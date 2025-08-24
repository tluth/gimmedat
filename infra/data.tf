data "aws_caller_identity" "current" {}

data "aws_ssm_parameter" "zoneid" {
  name = "/bulgingdiscs/dns/zoneid"
}

data "aws_route53_zone" "zone" {
  zone_id = data.aws_ssm_parameter.zoneid.value
}

data "aws_ssm_parameter" "post_confirmation_lambda_arn" {
  name = "/pocketdat-${local.environment}/lambda/post_confirmation_arn"
}

data "aws_s3_bucket" "permanent_storage" {
  bucket = "pocketdat-${local.environment}-file-storage"
}
