module "acm_request_certificate" {
  source = "./vendor/modules/terraform-aws-acm-request-certificate"

  providers = {
    aws = aws.useast1
  }

  context = module.this.context

  domain_name                       = local.product_domain
  subject_alternative_names         = local.product_domain_sans
  zone_id                           = data.aws_route53_zone.zone.id
  process_domain_validation_options = true
  ttl                               = "300"
}

module "cdn" {
  source = "./vendor/modules/terraform-aws-cloudfront-s3-cdn"

  context             = module.this.context
  aliases             = concat([local.product_domain], local.product_domain_sans)
  dns_alias_enabled   = true
  parent_zone_id      = data.aws_route53_zone.zone.id
  acm_certificate_arn = module.acm_request_certificate.arn

  minimum_protocol_version = "TLSv1.2_2021"

  custom_error_response = [{
    error_caching_min_ttl = 300
    error_code            = 404
    response_code         = 200
    response_page_path    = "/index.html"
  }]
  lambda_function_association = [{
    lambda_arn   = module.check_ip.lambda_function_qualified_arn
    event_type   = "viewer-request"
    include_body = false
    }
  ]
  depends_on = [module.acm_request_certificate, module.check_ip]
}