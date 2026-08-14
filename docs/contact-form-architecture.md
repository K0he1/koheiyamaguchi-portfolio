# Contact form architecture

このメモでは、ポートフォリオのトップページに問い合わせフォームを追加し、Azure Communication Services Emailで送信内容を通知する構成を整理する。

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
        │  Azure Communication Services Emailで送信
        ▼
サイト管理者のメールボックス
```

ブラウザからメールサービスへ直接送信するのではなく、Azure Functionsを中継する。
ブラウザが知るのは`/api/contact`というAPIのURLだけで、受信先のメールアドレスやAzureの認証情報は公開しない。

このフォームでは、常駐するWeb APIサーバーを用意しない。問い合わせが来たときだけHTTPトリガーのFunctionが起動し、処理が終わると実行も終了する。

## 2. 送信時の動線

1. ヘッダーまたはトップページ下部の`Contact`からフォームへ移動する。
2. 名前、メールアドレス、問い合わせ本文を入力する。
3. Next.jsのフォームから`POST /api/contact`を呼び出す。
4. Azure Functionsが入力値、文字数、honeypotを検証する。
5. 問題がなければAzure Communication Services Emailでサイト管理者へメールを送信する。
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
5. Azure Communication Services Emailを呼び出す
6. ブラウザには受信先アドレスを含めず、成功または一般的なエラーだけ返す

最初からメール送信まで作らず、以下の順番で確認すると理解しやすい。

```text
Phase 1: FunctionがJSONを受け取り、固定の成功レスポンスを返す
Phase 2: 入力検証とhoneypotを追加する
Phase 3: Azure Communication Services Emailでメールを送信する
Phase 4: 送信回数制限と監視を追加する
```

### 3.5 `api/package.json`

API用の依存関係をフロントエンドと分離する。`@azure/communication-email`を追加し、Azure Communication Services Emailの`EmailClient`を利用する。

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

メールの宛先やAzure Communication Servicesの認証情報は、コードやGitHubリポジトリに書かない。Azure Static Web AppsのConfiguration / Environment variablesに登録する。

例:

```text
CONTACT_TO_EMAIL
ACS_EMAIL_CONNECTION_STRING
ACS_SENDER_ADDRESS
```

`ACS_EMAIL_CONNECTION_STRING`はAzure Communication Servicesの接続文字列、`ACS_SENDER_ADDRESS`はEmail Communication Serviceに紐付けた送信元アドレスである。値はローカルの`api/local.settings.json`にも置けるが、`.gitignore`でcommit対象外にする。ブラウザへ返すレスポンスやフロントエンドの環境変数には、`CONTACT_TO_EMAIL`を含めない。

ローカル設定は`api/local.settings.json.example`をコピーして作る。Azureへは、Static Web AppsのConfiguration / Environment variablesに3つの値を登録する。GitHub ActionsのRepository secretに登録するデプロイトークンとは別の設定である。

## 4. Azure Communication Services Email

Azure Communication ServicesのEmail Communication Serviceを作成し、Azure管理ドメインまたは所有ドメインを接続する。接続文字列と送信元アドレスをAzureの環境変数へ登録し、APIから`EmailClient.beginSend`を呼び出す。

問い合わせ者のアドレスは`Reply-To`に設定する。送信元はAzureの検証済みアドレスを使いながら、受信後に問い合わせ者へ返信できる。

## 5. セキュリティと運用

- `mailto:`で受信先メールアドレスを公開しない
- Azure Communication Servicesの接続文字列をGitHub SecretsまたはAzureの環境変数に置く
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
- 受信先アドレスがHTML、JavaScript、レスポンスに含まれない
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
9. Azure Communication Services Email送信処理を追加する
10. Azure Static Web AppsのEnvironment variablesに本番の環境変数を設定する
11. GitHub Actionsでデプロイし、実際に受信できることを確認する

## 参考

- [Azure Static Web AppsにAPIを追加する](https://learn.microsoft.com/en-us/azure/static-web-apps/add-api)
- [Static Web Appsのビルド設定](https://learn.microsoft.com/en-us/azure/static-web-apps/build-configuration)
- [Azure Communication Services Emailでメールを送信する](https://learn.microsoft.com/en-us/azure/communication-services/quickstarts/email/send-email)
