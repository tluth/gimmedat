# resource "aws_ses_domain_identity" "sesid" {
#   domain = local.product_domain
# }

# resource "aws_ses_domain_mail_from" "ses" {
#   domain           = aws_ses_domain_identity.sesid.domain
#   mail_from_domain = "bounce.${aws_ses_domain_identity.sesid.domain}"
# }

# resource "aws_ses_domain_dkim" "ses" {
#   domain = aws_ses_domain_identity.sesid.domain
# }

# resource "aws_route53_record" "email_dkim_records" {
#   count   = 3
#   zone_id = data.aws_route53_zone.zone.id
#   name    = "${element(aws_ses_domain_dkim.ses.dkim_tokens, count.index)}._domainkey.${aws_ses_domain_identity.sesid.domain}"
#   type    = "CNAME"
#   ttl     = "300"
#   records = [
#     "${element(aws_ses_domain_dkim.ses.dkim_tokens, count.index)}.dkim.amazonses.com",
#   ]
# }

# resource "aws_route53_record" "bounce_spf" {
#   zone_id = data.aws_route53_zone.zone.id
#   name    = "bounce.${aws_ses_domain_identity.sesid.domain}"
#   type    = "TXT"
#   ttl     = "300"
#   records = [
#     "v=spf1 include:amazonses.com -all"
#   ]
# }

# resource "aws_route53_record" "bounce_mx" {
#   zone_id = data.aws_route53_zone.zone.id
#   name    = "bounce.${aws_ses_domain_identity.sesid.domain}"
#   type    = "MX"
#   ttl     = "300"
#   records = [
#     "10 feedback-smtp.eu-central-1.amazonses.com"
#   ]
# }

# resource "aws_iam_role" "iam_email_lambda" {
#   name               = "${local.site}-iam-email-lambda"
#   tags               = module.common_tags.tags
#   assume_role_policy = <<EOF
# {
#   "Version": "2012-10-17",
#   "Statement": [
#     {
#       "Action": "sts:AssumeRole",
#       "Principal": {
#         "Service": "lambda.amazonaws.com"
#       },
#       "Effect": "Allow"
#     }
#   ]
# }
# EOF
# }

# resource "aws_iam_policy" "email_lambda" {
#   name   = "${local.site}-email-lambda"
#   policy = data.aws_iam_policy_document.email_lambda.json
#   tags   = module.common_tags.tags
# }

# resource "aws_iam_role_policy_attachment" "email_lambda" {
#   policy_arn = aws_iam_policy.email_lambda.arn
#   role       = aws_iam_role.iam_email_lambda.name
# }

# data "aws_iam_policy_document" "email_lambda" {

#   statement {
#     sid       = "AllowSES2"
#     effect    = "Allow"
#     resources = [aws_ses_domain_identity.sesid.arn]
#     actions   = ["ses:SendRawEmail"]
#   }

#   statement {
#     sid       = "GetSecrets"
#     effect    = "Allow"
#     resources = [aws_secretsmanager_secret.secrets.arn]
#     actions = [
#       "secretsmanager:GetSecretValue"
#     ]
#   }

#   # restriction to just our lambda logs
#   #tfsec:ignore:aws-iam-no-policy-wildcards
#   statement {
#     sid    = "AllowWritingLogs"
#     effect = "Allow"
#     resources = [
#       "arn:aws:logs:${local.aws_region}:${data.aws_caller_identity.current.account_id}:log-group:/aws/lambda/${local.site}-email:*:*",
#       "arn:aws:logs:${local.aws_region}:${data.aws_caller_identity.current.account_id}:log-group:/aws/lambda/${local.site}-email:*"
#     ]
#     actions = [
#       "logs:PutLogEvents",
#       "logs:CreateLogStream",
#       "logs:CreateLogGroup"
#     ]
#   }
# }
