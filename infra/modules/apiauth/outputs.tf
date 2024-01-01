output "lambda_function_invoke_arn" {
  description = "The ARN of the api authorisor lambda"
  value       = module.lambda_api_authorizer.lambda_function_invoke_arn
}

output "lambda_function_name" {
  description = "The name of the api authorisor lambda"
  value       = module.lambda_api_authorizer.lambda_function_name
}
