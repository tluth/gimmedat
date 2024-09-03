data "archive_file" "email_sender" {
  type        = "zip"
  output_path = "${path.module}/../backend/email_sender.zip"
  source_dir  = "${path.module}/../backend/email_sender"
}

resource "aws_lambda_function" "email_sender" {
  function_name = "${local.site}-email-sender"
  role          = aws_lambda_function.api_lambda.role
  handler       = "s3_event_handler.new_object.lambda_handler"
  runtime       = var.lambda_runtime
  filename      = data.archive_file.email_sender.output_path
}

resource "aws_iam_role" "iam_email_lambda" {
  name               = "${local.site}-iam-email-lambda"
  assume_role_policy = <<EOF
    {
    "Version": "2012-10-17",
    "Statement": [
        {
        "Action": "sts:AssumeRole",
        "Principal": {
            "Service": "lambda.amazonaws.com"
        },
        "Effect": "Allow"
        }
    ]
    }
    EOF
}

resource "aws_iam_policy" "email_lambda" {
  name   = "${local.site}-email-lambda"
  policy = data.aws_iam_policy_document.email_lambda.json
}

resource "aws_iam_role_policy_attachment" "email_lambda" {
  policy_arn = aws_iam_policy.email_lambda.arn
  role       = aws_iam_role.iam_email_lambda.name
}

data "aws_iam_policy_document" "email_lambda" {

  statement {
    sid       = "AllowSES2"
    effect    = "Allow"
    resources = [module.ses.ses_domain_identity_arn]
    actions   = ["ses:SendRawEmail"]
  }

  # restriction to just our lambda logs
  #tfsec:ignore:aws-iam-no-policy-wildcards
  statement {
    sid    = "AllowWritingLogs"
    effect = "Allow"
    resources = [
      "arn:aws:logs:${local.aws_region}:${data.aws_caller_identity.current.account_id}:log-group:/aws/lambda/${local.site}-email-sender:*:*",
      "arn:aws:logs:${local.aws_region}:${data.aws_caller_identity.current.account_id}:log-group:/aws/lambda/${local.site}-email-sender:*"
    ]
    actions = [
      "logs:PutLogEvents",
      "logs:CreateLogStream",
      "logs:CreateLogGroup"
    ]
  }
}