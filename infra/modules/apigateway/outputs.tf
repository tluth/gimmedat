output "api_execution_arn" {
  description = "The ARN prefix to be used in an aws_lambda_permission's source_arn attribute or in an aws_iam_policy to authorize access to the @connections API."
  value       = module.api_gateway.apigatewayv2_api_execution_arn
}

output "api_id" {
  description = "The ID of the API Gateway."
  value       = module.api_gateway.apigatewayv2_api_id
}

output "api_domain_name" {
  description = "The domain name of the API Gateway."
  value       = local.product_domain
}

output "api_url" {
  description = "The URL of the API Gateway."
  value       = "https://${local.product_domain}"
}
