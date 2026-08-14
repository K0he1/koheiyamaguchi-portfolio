# Contact form architecture

このメモでは、ポートフォリオのトップページに問い合わせフォームを追加し、送信内容を自分のGmailへ転送する構成を整理する。

## 1. 目指す全体像

```text
訪問者のブラウザ
        │
        │  POST /api/contact
        ▼
Azure Static Web Apps
  ├─ Next.jsの静的フロントエンド
  └─ Managed Azure Functions（HTTP API）
        │
        │  Gmail APIで送信
        ▼
自分のGmail
```

ブラウザからGmailへ直接送信するのではなく、Azure Functionsを中継する。
ブラウザが知るのは`/api/contact`というAPIのURLだけで、受信先のGmailアドレスやGmailの認証情報は公開しない。

このフォームでは、常駐するWeb APIサーバーを用意しない。問い合わせが来たときだけHTTPトリガーのFunctionが起動し、処理が終わると実行も終了する。

## 2. 送信時の動線

1. ヘッダーまたはトップページ下部の`Contact`からフォームへ移動する。
2. 名前、メールアドレス、問い合わせ本文を入力する。
3. Next.jsのフォームから`POST /api/contact`を呼び出す。
4. Azure Functionsが入力値、文字数、honeypotを検証する。
5. 問題がなければGmail APIで自分のGmailへメールを送信する。
6. ブラウザには成功メッセージだけを返す。

初期版では問い合わせ内容をデータベースに保存しない。必要になった時点で、Azure Table Storageなどを追加する。

## 3. 編集するファイル

### 3.1 `app/page.tsx`

トップページにContactへの導線とフォームを追加する。

現在の`page.tsx`はサーバーコンポーネントなので、フォームの入力状態や送信中状態を管理する部分は別コンポーネントに分ける。

追加する例:

```text
app/
├─ page.tsx
└─ contact-form.tsx
```

`page.tsx`では、次のようにフォームコンポーネントを配置する。

```tsx
import ContactForm from "./contact-form";

// ...

<section className="section" id="contact">
  <p className="eyebrow">CONTACT</p>
  <h2>Contact</h2>
  <p className="section-copy">仕事や制作物についてのお問い合わせはこちらから。</p>
  <ContactForm />
</section>
```

### 3.2 `app/contact-form.tsx`

このファイルに`"use client"`を付け、以下を実装する。

- `name`、`email`、`message`の入力欄
- 送信ボタン
- `fetch("/api/contact", { method: "POST" })`
- 送信中の二重送信防止
- 成功・失敗メッセージ
- bot判定用の画面に見せないhoneypot欄

送信先は絶対URLではなく、同じドメイン上の相対URLにする。

```ts
await fetch("/api/contact", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ name, email, message, website }),
});
```

### 3.3 `app/globals.css`

フォーム用のスタイルを追加する。

- ラベルと入力欄の縦並び
- 入力欄のフォーカス表示
- 送信ボタンのdisabled表示
- エラーメッセージと成功メッセージ
- モバイル幅での余白調整

フォーム側で`aria-invalid`や`aria-describedby`も設定し、入力エラーを読み上げられるようにする。

### 3.4 `api/`

Azure FunctionsのAPIを追加する。まずはNode.jsのHTTP Functionとして作る。

```text
api/
├─ package.json
├─ host.json
└─ src/
   └─ functions/
      └─ contact.js
```

`contact.js`の責務は次のとおり。

1. HTTP POSTだけ受け付ける
2. JSONを読み込む
3. 必須項目と文字数を検証する
4. honeypotに値があればbotとして拒否する
5. Gmail APIを呼び出す
6. ブラウザにはGmailアドレスを含めず、成功または一般的なエラーだけ返す

最初からGmail送信まで作らず、以下の順番で確認すると理解しやすい。

```text
Phase 1: FunctionがJSONを受け取り、固定の成功レスポンスを返す
Phase 2: 入力検証とhoneypotを追加する
Phase 3: Gmail APIでメールを送信する
Phase 4: 送信回数制限と監視を追加する
```

### 3.5 `api/package.json`

API用の依存関係をフロントエンドと分離する。Gmail APIを使う段階で`googleapis`を追加する。

```json
{
  "private": true,
  "dependencies": {
    "@azure/functions": "^4.0.0",
    "googleapis": "^150.0.0"
  }
}
```

実際に追加するバージョンは、インストール時点で安定版を確認して固定する。

### 3.6 `.github/workflows/deploy.yml`

現在は`out/`をあらかじめビルドしてデプロイしている。APIを同時にデプロイするため、Deployステップを次の考え方に変更する。

```yaml
app_location: out
api_location: api
output_location: ""
skip_app_build: true
```

`app_location`と`api_location`はリポジトリルートからの相対パスで指定する。フロントエンドの事前ビルドを継続しつつ、APIはStatic Web Appsのデプロイ処理にビルドさせる構成である。

変更後は、GitHub Actionsのログで以下を確認する。

- `out`がアプリの配置先として認識される
- `api`がAPIの配置先として認識される
- APIのビルドが成功する
- デプロイ後に`/api/contact`へ到達できる

### 3.7 Azureのアプリ設定

Gmailの宛先や認証情報は、コードやGitHubリポジトリに書かない。Azure Static Web AppsのConfiguration / Environment variablesに登録する。

例:

```text
CONTACT_TO_EMAIL
GMAIL_CLIENT_ID
GMAIL_CLIENT_SECRET
GMAIL_REFRESH_TOKEN
```

値はローカルの`api/local.settings.json`にも置けるが、`.gitignore`でcommit対象外にする。ブラウザへ返すレスポンスやフロントエンドの環境変数には、`CONTACT_TO_EMAIL`を含めない。

ローカル設定は`api/local.settings.json.example`をコピーして作る。Azureへは、Static Web AppsのConfiguration / Environment variablesに同じ4つの値を登録する。GitHub ActionsのRepository secretに登録するデプロイトークンとは別の設定である。

## 4. Gmail送信方式

第一候補はGmail APIである。送信専用のOAuthスコープを使い、Azure Functionsの環境変数にrefresh tokenを保管する。

SMTP + Gmailアプリパスワードでも実装できるが、アプリパスワードの管理範囲が広くなりやすい。学習用の簡易版として使う場合も、2段階認証を有効にし、パスワードをコードに書かない。

## 5. セキュリティと運用

- `mailto:`でGmailアドレスを公開しない
- Gmail APIの秘密情報をGitHub SecretsまたはAzureの環境変数に置く
- 入力文字数を制限する
- メールアドレスをサーバー側でも検証する
- honeypotを設置する
- 同一IPからの連続送信を制限する
- エラー内容に内部設定やメールアドレスを含めない
- Cost alertsを設定して、想定外の大量実行を通知する

## 6. ローカル確認

フロントエンドだけの確認:

```bash
pnpm dev
```

APIを含む本番に近い確認では、Azure Static Web Apps CLIなどのローカルエミュレーターを使う。まずはFunction単体をHTTPリクエストで確認し、その後にフォームから送信する。

確認項目:

- 正常な入力で成功メッセージが出る
- 必須項目が空の場合に送信できない
- 不正なメールアドレスを拒否する
- honeypot入力を拒否する
- GmailアドレスがHTML、JavaScript、レスポンスに含まれない
- 連続送信を制限できる

## 7. 実装順序

1. `docs`の設計を確認する
2. `app/contact-form.tsx`を作り、フォームだけ表示する
3. `app/page.tsx`にContactセクションを追加する
4. `app/globals.css`でフォームを整える
5. `api/`に固定レスポンスを返すFunctionを作る
6. `deploy.yml`の`api_location`を設定する
7. ローカルでフォームからAPIを呼ぶ
8. `api/local.settings.json`でローカルの環境変数を設定する
9. Gmail API送信処理を追加する
10. Azure Static Web AppsのEnvironment variablesに本番の環境変数を設定する
11. GitHub Actionsでデプロイし、実際に受信できることを確認する

## 参考

- [Azure Static Web AppsにAPIを追加する](https://learn.microsoft.com/en-us/azure/static-web-apps/add-api)
- [Static Web Appsのビルド設定](https://learn.microsoft.com/en-us/azure/static-web-apps/build-configuration)
