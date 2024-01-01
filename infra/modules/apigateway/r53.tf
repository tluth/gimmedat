resource "aws_route53_record" "api" {
  zone_id = data.aws_route53_zone.public.id
  name    = local.product_domain
  type    = "A"

  alias {
    name                   = var.deploy_api_versioning ? aws_apigatewayv2_domain_name.version_domain[0].domain_name_configuration[0].target_domain_name : module.api_gateway.apigatewayv2_domain_name_configuration[0].target_domain_name
    zone_id                = var.deploy_api_versioning ? aws_apigatewayv2_domain_name.version_domain[0].domain_name_configuration[0].hosted_zone_id : module.api_gateway.apigatewayv2_domain_name_configuration[0].hosted_zone_id
    evaluate_target_health = false
  }
}
