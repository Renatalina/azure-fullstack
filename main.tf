# Configure the Azure provider
terraform {
  required_providers {
    azurerm = {
      source  = "hashicorp/azurerm"
      version = "~> 3.73.2"
    }
  }
 
  required_version = ">= 1.1.0"
}
 
provider "azurerm" {
  features {}
}
 
resource "azurerm_resource_group" "front_end_rg4444" {
  name     = "rg-frontend-sand-ne-4444"
  location = "northeurope"
}
 
resource "azurerm_storage_account" "front_end_storage_account" {
  name     = "natalinaoverlords"
  location = "northeurope"
 
  account_replication_type = "LRS"
  account_tier             = "Standard"
  account_kind             = "StorageV2"
  resource_group_name      = azurerm_resource_group.front_end_rg4444.name
 
  static_website {
    index_document = "index.html"
  }
}
