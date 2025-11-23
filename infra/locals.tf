locals {
  envs = {
    "dev"     = "dev"
    "prod"    = "prod"
    "default" = "dev"
  }
  environment = local.envs[terraform.workspace]

  aws_regions = {
    "dev"  = var.default_region
    "prod" = var.default_region
  }
  aws_region = local.aws_regions[local.environment]

  site                    = "${var.product}-${local.environment}"
  file_storage_table_name = "${var.product}-${local.environment}-files"

  product_domain     = "${var.product}.${data.aws_route53_zone.zone.name}"
  product_domain_api = "api.${local.product_domain}"
}
