terraform {
  backend "azurerm" {
    resource_group_name  = "rg-jbdc-tfstate"
    storage_account_name = "stjbdctfstate01"
    container_name       = "tfstate"
    key                  = "portfolio-prod.tfstate"
    use_azuread_auth     = true
  }
}
