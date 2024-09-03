module "ses" {
  source = "./vendor/modules/cloudposse/terraform-aws-ses"
  domain        = local.product_domain
  zone_id       = data.aws_route53_zone.zone.id
  verify_dkim   = true
  verify_domain = true
  context = module.this.context
  create_spf_record = true
  # iam_allowed_resources = [ aws_lambda_function.email_sender.arn ]
}