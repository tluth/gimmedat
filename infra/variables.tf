## Module Variables
variable "product" {
  description = "name of the deployed product infra"
  type        = string
  default     = "gimmedat"
}

variable "default_region" {
  description = "The AWS region"
  type        = string
  default     = "eu-central-1"
}

#
# Stack variables
#
variable "lambda_log_retention" {
  type        = number
  default     = 7
  description = "number of days to store lambda logs"
}

variable "lambda_runtime" {
  type        = string
  description = "The runtime for lambda functions"
  default     = "python3.10"
}

variable "lambda_loglevel" {
  type        = string
  description = "The log level for lambda functions"
  default     = "DEBUG"
}

variable "api_lambda_memory" {
  type        = number
  default     = 128
  description = "Memory allocation of the internal api lambda"
}

variable "api_lambda_timeout" {
  type        = number
  default     = 30
  description = "Timeout for the internal api lambda (in seconds)"
}

variable "ghaction_role_conditions" {
  type = list(object({ test = string, variable = string, values = list(string) }))

  default = [{
    test     = "StringLike"
    variable = "token.actions.githubusercontent.com:sub"
    values   = ["repo:tluth/gimmedat:*"]
  }]
  description = "list of conditions to apply to the ghaction role"
}