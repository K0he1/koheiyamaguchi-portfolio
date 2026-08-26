output "application_insights_connection_string" {
  description = "Connection string for client-side Application Insights telemetry."
  value       = azurerm_application_insights.app.connection_string
  sensitive   = true
}
