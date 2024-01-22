module "api_gateway" {
  source  = "terraform-aws-modules/apigateway-v2/aws"
  version = "2.2.2"

  name          = "${module.this.id}-${var.name_suffix}"
  description   = "${module.this.id}-${var.name_suffix} HTTP API Gateway"
  protocol_type = "HTTP"

  cors_configuration = {
    allow_headers = var.allow_headers
    allow_methods = var.allow_methods
    allow_origins = concat(["https://${local.product_domain}"], var.additional_cors_origins)
  }

  # Custom domain
  create_api_domain_name      = var.deploy_api_versioning ? false : true
  domain_name                 = var.deploy_api_versioning ? null : local.product_domain
  domain_name_certificate_arn = var.deploy_api_versioning ? null : module.certificate.acm_certificate_arn

  # Access logs
  default_stage_access_log_destination_arn = aws_cloudwatch_log_group.api.arn
  default_stage_access_log_format          = var.api_access_log_format

  default_route_settings = {
    detailed_metrics_enabled = true
    throttling_burst_limit   = 10
    throttling_rate_limit    = 10
  }

  integrations = {
    for k, v in var.api_integrations :
    v.route_key => {
      lambda_arn             = v.lambda_arn
      payload_format_version = "2.0"
      timeout_milliseconds   = v.timeout_milliseconds
      authorization_type     = v.authorization_type
      authorizer_id          = try(v.authorizer_id, null)
    }
  }
}

resource "aws_apigatewayv2_domain_name" "version_domain" {
  count = var.deploy_api_versioning ? 1 : 0

  domain_name = local.product_domain

  domain_name_configuration {
    certificate_arn = module.certificate.acm_certificate_arn
    endpoint_type   = "REGIONAL"
    security_policy = "TLS_1_2"
  }
}

resource "aws_apigatewayv2_api_mapping" "example" {
  count = var.deploy_api_versioning ? 1 : 0

  api_id          = module.api_gateway.apigatewayv2_api_id
  domain_name     = aws_apigatewayv2_domain_name.version_domain[0].id
  stage           = module.api_gateway.default_apigatewayv2_stage_id
  api_mapping_key = var.api_version
}
