data "aws_elb_service_account" "default" {
}

data "aws_iam_policy_document" "alb_write" {
  statement {
    sid = ""
    principals {
      type        = "AWS"
      identifiers = [join("", data.aws_elb_service_account.default.*.arn)]
    }
    effect = "Allow"
    actions = [
      "s3:PutObject"
    ]
    resources = [
      "arn:aws:s3:::${module.this.id}-logs/*",
    ]
  }
  statement {
    sid = ""
    principals {
      type        = "Service"
      identifiers = ["delivery.logs.amazonaws.com"]
    }
    effect = "Allow"
    actions = [
      "s3:PutObject"
    ]
    resources = [
      "arn:aws:s3:::${module.this.id}-logs/*",
    ]
    condition {
      test     = "StringEquals"
      variable = "s3:x-amz-acl"
      values   = ["bucket-owner-full-control"]
    }
  }
  statement {
    sid    = ""
    effect = "Allow"
    principals {
      type        = "Service"
      identifiers = ["delivery.logs.amazonaws.com"]
    }
    actions = [
      "s3:GetBucketAcl"
    ]
    resources = [
      "arn:aws:s3:::${module.this.id}-logs",
    ]
  }
}

module "log_storage" {
  source = "cloudposse/s3-log-storage/aws"
  context    = module.this.context
  attributes = ["logs"]

  policy                   = data.aws_iam_policy_document.alb_write.json
  acl                      = "log-delivery-write"
  standard_transition_days = 30
  expiration_days          = 90
}
