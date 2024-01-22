variable "name_suffix" {
  description = "Name to use for the API gateway"
  type        = string
}

variable "cw_log_group_prefix" {
  description = "Prefix for Cloudwatch log groups"
  type        = string
}

variable "cw_logs_retention_period" {
  description = "The number of days to retain log files."
  type        = number
}

variable "certificate_validation_record_ttl" {
  description = "Time to live in seconds"
  type        = string
  default     = "300"
}

variable "api_integrations" {
  description = "Map of API gateway routes with integrations"
  type        = list(map(any))
  default     = []
}

variable "allow_headers" {
  description = "Set of allowed HTTP headers"
  type        = set(string)
  default     = ["content-type", "x-amz-date", "authorization", "x-api-key", "x-amz-security-token", "x-amz-user-agent"]
}

variable "allow_methods" {
  description = "Set of allowed HTTP methods"
  type        = set(string)
}

variable "deploy_api_versioning" {
  description = "Deploy a versioning on the API"
  type        = bool
  default     = false
}

variable "api_version" {
  description = "Default version stage to deploy"
  type        = string
  default     = "v1"
}

variable "api_access_log_format" {
  description = "API Access Log Format"
  type        = string
  default     = "$context.identity.sourceIp - - [$context.requestTime] \"$context.httpMethod $context.path $context.protocol\" $context.status $context.responseLength $context.requestId $context.integrationErrorMessage $context.integration.latency $context.authorizer.error $context.authorizer.latency"
}

variable "additional_cors_origins" {
  description = "Additional CORS origins to use in the API"
  type        = list(string)
  default     = []
}
