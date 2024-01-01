variable "product" {
  type        = string
  description = "name of the deployed product infra"
}

variable "lambda_loglevel" {
  type        = string
  description = "The log level for Atlas lambda functions"
  default     = "INFO"
}

variable "lambda_log_retention" {
  type        = number
  default     = 30
  description = "number of days to store lambda logs"
}

variable "lambda_timeout" {
  type        = number
  default     = 10
  description = "timeout for the lambda"
}

variable "lambda_memory" {
  type        = number
  default     = 256
  description = "memory allocation of the lambda"
}


variable "auth_default_tenant" {
  type        = string
  default     = "bf12581f-2263-450d-8668-1c7f7f54e348"
  description = "The default tenant we use if we dont define use a multi-tenanted API"
}

variable "azure_oauth_client_secret" {
  type        = string
  description = "Azure Oauth client API Secret for the Azure Geo API app registration"
}

variable "azure_oauth_client_id" {
  type        = string
  description = "Azure Oauth client id for the Azure Geo API app registration"
}

variable "azure_oauth_tenant_id" {
  type        = string
  description = "Azure Oauth tenant id for the Azure Geo API app registration"
}

