# setup our namespacing
module "this" {
  source = "./vendor/modules/cloudposse/terraform-null-label"

  environment = local.environment
  name        = var.product
  attributes  = []
  delimiter   = "-"

  label_order = ["name", "environment", "attributes"]

  labels_as_tags = []
}
