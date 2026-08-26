data "azurerm_log_analytics_workspace" "shared_monitoring" {
  name                = "log-k-lab-prod-01"
  resource_group_name = "rg-k-lab-monitoring-prod"
}

resource "azurerm_application_insights" "app" {
  name                = "appi-kohei-portfolio-prod-01"
  location            = azurerm_resource_group.app.location
  resource_group_name = azurerm_resource_group.app.name
  application_type    = "web"
  workspace_id        = data.azurerm_log_analytics_workspace.shared_monitoring.id
  tags                = var.tags
}
