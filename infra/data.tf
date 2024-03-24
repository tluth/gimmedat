data "aws_caller_identity" "current" {}

data "aws_ssm_parameter" "zoneid" {
  name = "/bulgingdiscs/dns/zoneid"
}

data "aws_route53_zone" "zone" {
  zone_id = data.aws_ssm_parameter.zoneid.value
}
