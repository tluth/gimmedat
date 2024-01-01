module "certificate" {
  source = "../../vendor/modules/terraform-aws-modules/acm"

  domain_name         = local.product_domain
  zone_id             = data.aws_ssm_parameter.r53_public_zone_id.value
  wait_for_validation = true
  dns_ttl             = var.certificate_validation_record_ttl
}
