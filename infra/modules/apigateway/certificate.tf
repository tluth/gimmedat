module "certificate" {
  source  = "terraform-aws-modules/acm/aws"
  version = "5.0.0"

  domain_name         = local.product_domain
  zone_id             = data.aws_ssm_parameter.r53_public_zone_id.value
  wait_for_validation = true
  dns_ttl             = var.certificate_validation_record_ttl
}
