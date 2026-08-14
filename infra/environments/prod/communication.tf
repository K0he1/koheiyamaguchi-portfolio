data "azurerm_resource_group" "portfolio" {
  name = var.resource_group_name
}

resource "azurerm_communication_service" "portfolio" {
  name                = "acs-kohei-portfolio-prod"
  resource_group_name = data.azurerm_resource_group.portfolio.name
  data_location       = "Japan"

  tags = {
    environment = "prod"
    managed-by  = "terraform"
    project     = "koheiyamaguchi-portfolio"
  }
}

resource "azurerm_email_communication_service" "portfolio" {
  name                = "ecs-kohei-portfolio-prod"
  resource_group_name = data.azurerm_resource_group.portfolio.name
  data_location       = "Japan"

  tags = {
    environment = "prod"
    managed-by  = "terraform"
    project     = "koheiyamaguchi-portfolio"
  }
}

resource "azurerm_email_communication_service_domain" "azure_managed" {
  name              = "AzureManagedDomain"
  email_service_id  = azurerm_email_communication_service.portfolio.id
  domain_management = "AzureManaged"
}

resource "azurerm_communication_service_email_domain_association" "portfolio" {
  communication_service_id = azurerm_communication_service.portfolio.id
  email_service_domain_id  = azurerm_email_communication_service_domain.azure_managed.id
}