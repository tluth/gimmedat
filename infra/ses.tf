# module "ses" {
#   source = "./vendor/modules/cloudposse/terraform-aws-ses"
#   domain        = local.product_domain
#   zone_id       = data.aws_route53_zone.zone.id
#   verify_dkim   = true
#   verify_domain = true

#   context = module.this.context
#   create_spf_record = true
#   iam_allowed_resources = [ aws_lambda_function.email_sender.arn ]
# }


resource "aws_ses_domain_identity" "sesid" {
  domain = local.product_domain
}

resource "aws_ses_email_identity" "no_reply_email" {
  email = "no-reply@${local.product_domain}"
}

resource "aws_s3_bucket" "email_bucket" {
  bucket = "${local.site}-emails"
  lifecycle {
    ignore_changes = [
      server_side_encryption_configuration,
    ]
  }

}

resource "aws_s3_bucket_server_side_encryption_configuration" "email_bucket" {
  bucket = aws_s3_bucket.email_bucket.bucket

  rule {
    bucket_key_enabled = true
    apply_server_side_encryption_by_default {
      sse_algorithm = "AES256"
    }
  }
}

resource "aws_s3_bucket_public_access_block" "block_email_public_access" {
  bucket                  = aws_s3_bucket.email_bucket.bucket
  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}

resource "aws_s3_bucket_policy" "b" {
  bucket = aws_s3_bucket.email_bucket.id
  policy = <<EOF
{
    "Version": "2012-10-17",
    "Statement": [
       {
           "Sid": "AllowSESPuts",
           "Effect": "Allow",
           "Principal": {
               "Service": "ses.amazonaws.com"
           },
           "Action": "s3:PutObject",
           "Resource": [
           "${aws_s3_bucket.email_bucket.arn}",
           "${aws_s3_bucket.email_bucket.arn}/*"
         ],
           "Condition": {
            "StringEquals": {
                   "aws:Referer": "${data.aws_caller_identity.current.account_id}"
                }
           }
       }
   ]
}
EOF

}

resource "aws_ses_receipt_rule_set" "main" {
  rule_set_name = "${local.site}-rule-set"
}

resource "aws_ses_receipt_rule" "store" {
  name          = "store"
  rule_set_name = aws_ses_receipt_rule_set.main.id
  recipients = [
    "data@${local.product_domain}",
    "no-reply@${local.product_domain}"
  ]
  enabled      = true
  scan_enabled = true

  add_header_action {
    header_name  = "Custom-Header"
    header_value = "Added by SES"
    position     = 1
  }

  s3_action {
    bucket_name = aws_s3_bucket.email_bucket.id
    position    = 2
  }
  depends_on = [
    aws_ses_receipt_rule_set.main,
    aws_s3_bucket_policy.b
  ]
}



resource "aws_ses_domain_mail_from" "ses" {
  domain           = aws_ses_domain_identity.sesid.domain
  mail_from_domain = "bounce.${aws_ses_domain_identity.sesid.domain}"
}

resource "aws_ses_domain_dkim" "ses" {
  domain = aws_ses_domain_identity.sesid.domain
}

resource "aws_route53_record" "email_dkim_records" {
  count   = 3
  zone_id = data.aws_route53_zone.zone.id
  name    = "${element(aws_ses_domain_dkim.ses.dkim_tokens, count.index)}._domainkey.${aws_ses_domain_identity.sesid.domain}"
  type    = "CNAME"
  ttl     = "300"
  records = [
    "${element(aws_ses_domain_dkim.ses.dkim_tokens, count.index)}.dkim.amazonses.com",
  ]
}

resource "aws_route53_record" "bounce_spf" {
  zone_id = data.aws_route53_zone.zone.id
  name    = "bounce.${aws_ses_domain_identity.sesid.domain}"
  type    = "TXT"
  ttl     = "300"
  records = [
    "v=spf1 include:amazonses.com -all"
  ]
}

resource "aws_route53_record" "bounce_mx" {
  zone_id = data.aws_route53_zone.zone.id
  name    = "bounce.${aws_ses_domain_identity.sesid.domain}"
  type    = "MX"
  ttl     = "300"
  records = [
    "10 feedback-smtp.eu-west-1.amazonses.com"
  ]
}
