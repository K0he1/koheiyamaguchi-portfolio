# Portfolio production infrastructure

このディレクトリでは、ポートフォリオ用のAzure Static Web AppsをTerraformで管理します。

## 初回セットアップ

`terraform.tfvars.example`をコピーして、Azure subscription IDを設定します。

```bash
cp terraform.tfvars.example terraform.tfvars
terraform init
terraform fmt
terraform validate
terraform plan
terraform apply
```

## GitHub Actions用デプロイトークン

作成後、以下でトークンを取得できます。トークンは表示・共有せず、GitHub ActionsのRepository secretに登録してください。

```bash
terraform output -raw static_web_app_api_key
```

Secret名:

```text
AZURE_STATIC_WEB_APPS_API_TOKEN
```
