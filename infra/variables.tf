## Module Variables
variable "product" {
  description = "name of the deployed product infra"
  type        = string
  default     = "gimmedat"
}

variable "default_region" {
  description = "The AWS region"
  type        = string
  default     = "eu-west-1"
}

#
# Stack variables
#
variable "lambda_log_retention" {
  type        = number
  default     = 30
  description = "number of days to store lambda logs"
}

variable "lambda_loglevel" {
  type        = string
  description = "The log level for Atlas lambda functions"
  default     = "INFO"
}

variable "internal_api_lambda_memory" {
  type        = number
  default     = 128
  description = "Memory allocation of the internal api lambda"
}

variable "internal_api_lambda_timeout" {
  type        = number
  default     = 30
  description = "Timeout for the internal api lambda (in seconds)"
}
