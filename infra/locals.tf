locals {
  envs = {
    "dev"     = "dev"
    "prod"    = "prod"
  }
  environment = local.envs[terraform.workspace]

  aws_regions = {
    "dev"     = var.default_region
    "prod"    = var.default_region
  }
  aws_region = local.aws_regions[local.environment]
}
