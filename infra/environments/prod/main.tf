resource "azurerm_resource_group" "app" {
  name     = var.resource_group_name
  location = var.resource_group_location
  tags     = var.tags
}

resource "azurerm_static_web_app" "app" {
  name                = var.static_web_app_name
  resource_group_name = azurerm_resource_group.app.name
  location            = var.static_web_app_location
  sku_tier            = "Free"
  sku_size            = "Free"
  tags                = var.tags
}
