variable "subscription_id" {
  description = "Azure subscription ID for the portfolio production environment."
  type        = string
  sensitive   = true
}

variable "resource_group_location" {
  description = "Azure region recorded on the portfolio resource group."
  type        = string
  default     = "japaneast"
}

variable "static_web_app_location" {
  description = "Azure region for Azure Static Web Apps."
  type        = string
  default     = "eastasia"
}

variable "resource_group_name" {
  description = "Resource group name for the portfolio production environment."
  type        = string
  default     = "rg-kohei-portfolio-prod"
}

variable "static_web_app_name" {
  description = "Globally unique Azure Static Web Apps name."
  type        = string

  validation {
    condition     = can(regex("^[a-z0-9][a-z0-9-]{0,39}$", var.static_web_app_name))
    error_message = "static_web_app_name must be 1-40 lowercase letters, numbers, or hyphens and start with a letter or number."
  }
}

variable "tags" {
  description = "Tags applied to portfolio production resources."
  type        = map(string)
  default = {
    project     = "koheiyamaguchi-portfolio"
    environment = "prod"
    managed-by  = "terraform"
    owner       = "koheiyamaguchi"
  }
}
