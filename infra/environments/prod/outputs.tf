output "resource_group_name" {
  description = "Portfolio production resource group name."
  value       = azurerm_resource_group.app.name
}

output "static_web_app_name" {
  description = "Azure Static Web Apps resource name."
  value       = azurerm_static_web_app.app.name
}

output "static_web_app_default_host_name" {
  description = "Default hostname assigned to the Static Web App."
  value       = azurerm_static_web_app.app.default_host_name
}

output "static_web_app_api_key" {
  description = "Deployment token for GitHub Actions."
  value       = azurerm_static_web_app.app.api_key
  sensitive   = true
}
