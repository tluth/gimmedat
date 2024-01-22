# setup our namespacing
module "this" {
  source = "cloudposse/label/null"

  environment = local.environment
  name        = var.product
  attributes  = []
  delimiter   = "-"

  label_order = ["name", "environment", "attributes"]

  labels_as_tags = []
}
