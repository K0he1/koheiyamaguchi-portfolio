# K Lab Studio — Portfolio

[![Deploy Portfolio](https://github.com/K0he1/koheiyamaguchi-portfolio/actions/workflows/deploy.yml/badge.svg)](https://github.com/K0he1/koheiyamaguchi-portfolio/actions/workflows/deploy.yml)

**公開サイト:** [https://www.k-lab-studio.com/](https://www.k-lab-studio.com/)<br />
**GitHub:** [github.com/K0he1/koheiyamaguchi-portfolio](https://github.com/K0he1/koheiyamaguchi-portfolio)<br />
**LinkedIn:** [Kohei Yamaguchi](https://www.linkedin.com/in/kohei-yamaguchi-06429827a/)

## 概要

Kohei Yamaguchiのプロフィールと制作物を紹介するポートフォリオサイトです。

Webアプリ開発に必要なスキル[^1]を学ぶことと自身の制作物を公開することを目的として作りました。

[^1]: 設計、フロントエンド、バックエンド、クラウドインフラ、CI/CDなどのスキル

## このリポジトリで確認できること

- サービスの目的・対象ユーザーを整理した要件定義
- Next.js / TypeScriptによるUI実装
- レスポンシブデザインとアクセシビリティを意識した画面設計
- ESLint・Vitest・TypeScriptによる品質チェック
- TerraformによるAzureリソースのコード管理
- GitHub Actionsによる自動ビルド・デプロイ
- Azure Static Web Appsを中心としたクラウド構成
- Azure FunctionsとAzure Communication Services Emailによる問い合わせフォーム
- 秘密情報をソースコードへ含めない運用設計

## 制作物

### 日本の営業日カウンター

日本の任意の月について、土日・祝日・有給休暇を考慮した営業日数を計算するWebアプリです。自分の勤怠管理のために必要なので作りました。

- **公開サイト:** [営業日カウンターを開く](https://thankful-meadow-02df09f00.7.azurestaticapps.net)
<!-- - **ソースコード:** [K0he1/japan-businessday-count-app](https://github.com/K0he1/japan-businessday-count-app) -->
- **技術:** Next.js / TypeScript / React / Vitest / Azure Static Web Apps
- **主な機能:** 2000〜2030年の祝日対応、年月選択、月移動、有給休暇の登録、カレンダー表示

### 洪水リスクの計算例

洪水・浸水による物理的リスクについて、気候シナリオ、浸水深、被害率、資産価値、期待被害額の関係を紹介するサービスページです。SSBJ・IFRS S2などの気候関連開示を検討する際の分析の入口となる計算例を掲載しています。

2026年8月の千葉の洪水被害を見て、以前作った数理モデルで何か出来ないかと思い、作りました。

- **公開サイト:** [洪水リスクページを開く](https://ashy-island-028b91e00.7.azurestaticapps.net/)
<!-- - **ソースコード:** [K0he1/flood-risk-simulator](https://github.com/K0he1/flood-risk-simulator) -->
- **技術:** Next.js / TypeScript / Terraform / Azure Static Web Apps / Python
- **主な内容:** 気候シナリオ、浸水深・被害率の表、期待被害額、前提条件、限界、不確実性

このページは計算例の紹介を目的としており、SSBJ・IFRS S2への準拠、開示判断、監査・保証を提供するものではありません。

## アーキテクチャ

ポートフォリオサイトは、静的配信を中心としたAzure Static Web Apps構成です。問い合わせフォームはManaged Azure Functions APIを経由し、Azure Communication Services Emailでサイト管理者へ通知します。受信先メールアドレスや認証情報をブラウザへ公開しない構成にしています。

```text
訪問者のブラウザ
      │
      ▼
Azure Static Web Apps
  ├─ Next.js 静的フロントエンド
  └─ Managed Azure Functions（/api/contact）
          │
          ▼
Azure Communication Services Email
```

Azureリソースは `infra/environments/prod/` のTerraformコードで管理しています。Terraform stateはAzure Blob Storageへ保存し、環境変数・GitHub Repository Secretなどを使って秘密情報を管理しています。

## 技術スタックと開発プラクティス

| 領域 | 利用技術・方針 |
| --- | --- |
| フロントエンド | Next.js、React、TypeScript、レスポンシブCSS |
| 品質管理 | Vitest、ESLint、TypeScriptのビルドチェック |
| クラウド | Azure Static Web Apps、Managed Azure Functions、Communication Services Email |
| インフラ | Terraform、AzureRM Provider、Azure Blob Storage backend |
| CI/CD | GitHub Actionsによる install → lint → build → deploy |
| セキュリティ | Secretの分離、サーバー側入力検証、honeypot、送信回数制限 |

## ローカル開発

```bash
pnpm install
pnpm dev
```

開発サーバーは [http://localhost:3000](http://localhost:3000) で確認できます。

変更前後には、以下を実行します。

```bash
pnpm lint
pnpm test
pnpm build
```

## リポジトリ構成

```text
app/                       Next.jsのページとUIコンポーネント
api/                       Managed Azure Functions API
infra/environments/prod/   本番AzureリソースのTerraformコード
docs/                      アーキテクチャ・運用メモ
public/                    静的アセット
.github/workflows/         GitHub Actionsのデプロイワークフロー
```

## プロフィール

- **現在の関心:** ソフトウェア開発、クラウドアプリケーション、データ活用
- **バックグラウンド:** データサイエンス、統計・データ分析
- **学歴:** 京都大学大学院、明治大学
- **技術領域:** Python、TypeScript、Next.js、Azure、Terraform、生成AI
- **個人活動:** データとアルゴリズムを用いたFX・株価指数先物のクオンツトレード

詳細は[ポートフォリオサイト](https://www.k-lab-studio.com/)または[LinkedIn](https://www.linkedin.com/in/kohei-yamaguchi-06429827a/)をご覧ください。

## 利用について

本リポジトリは個人のポートフォリオおよび学習目的のプロジェクトです。デザイン、文章、画像などの再利用については、事前にお問い合わせください。
