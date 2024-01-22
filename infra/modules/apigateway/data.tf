data "aws_region" "current" {}

data "aws_ssm_parameter" "r53_public_zone_id" {
  name = "/${module.this.context.namespace}/baseline/dns/zoneid"
}

data "aws_route53_zone" "public" {
  zone_id = data.aws_ssm_parameter.r53_public_zone_id.value
}