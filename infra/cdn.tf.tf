provider "aws" {
  alias  = "us_east_1"
  region = "us-east-1"
}

module "acm_request_certificate" {
  source = "./vendor/modules/cloudposse/terraform-aws-acm-request-certificate"

  providers = {
    aws = aws.us_east_1
  }

  context = module.this.context

  domain_name                       = local.product_domain
  zone_id                           = data.aws_route53_zone.zone.id
  process_domain_validation_options = true
  ttl                               = "300"
}

module "cdn" {
  source = "./vendor/modules/terraform-aws-cloudfront-s3-cdn"

  context             = module.this.context
  aliases             = [local.product_domain]
  dns_alias_enabled   = true
  parent_zone_id      = data.aws_route53_zone.zone.id
  acm_certificate_arn = module.acm_request_certificate.arn

  minimum_protocol_version = "TLSv1.2_2021"

  cloudfront_access_log_prefix        = "spa/"
  cloudfront_access_log_create_bucket = false
  cloudfront_access_log_bucket_name   = module.log_storage.bucket_id

  custom_error_response = [{
    error_caching_min_ttl = 300
    error_code            = 404
    response_code         = 200
    response_page_path    = "/index.html"
  }]

  depends_on = [module.acm_request_certificate]
}
