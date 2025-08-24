# Logging
resource "aws_cloudwatch_log_group" "s3_event_handler_logs" {
  name              = "/aws/lambda/${aws_lambda_function.s3_event_handler.function_name}"
  retention_in_days = 14
}

data "archive_file" "s3_event_handler" {
  type        = "zip"
  output_path = "${path.module}/../backend/s3_event_handler_build.zip"
  source_dir  = "${path.module}/../backend/s3_event_handler"
}

resource "aws_lambda_function" "s3_event_handler" {
  function_name = "${local.site}-s3-event-handler"
  role          = aws_iam_role.s3_event_handler_role.arn
  handler       = "s3_event_handler.new_object.lambda_handler"
  runtime       = var.lambda_runtime
  filename      = data.archive_file.s3_event_handler.output_path
  architectures = ["x86_64"]
}

resource "aws_s3_bucket_notification" "lambda_trigger" {
  bucket = aws_s3_bucket.main_storage.id
  lambda_function {
    lambda_function_arn = aws_lambda_function.s3_event_handler.arn
    events              = ["s3:ObjectCreated:*"]
  }
}

resource "aws_lambda_permission" "s3_event_trigger" {
  statement_id  = "AllowS3Invoke"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.s3_event_handler.function_name
  principal     = "s3.amazonaws.com"
  source_arn    = "arn:aws:s3:::${aws_s3_bucket.main_storage.id}"
}

resource "aws_iam_role" "s3_event_handler_role" {
  name               = "iam-${local.site}-s3-event-handler-role"
  assume_role_policy = <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
      {
          "Action": "sts:AssumeRole",
          "Principal": {
              "Service": "lambda.amazonaws.com"
          },
          "Effect": "Allow",
          "Sid": ""
      }
  ]
}
EOF
}

### Additional permissions
data "aws_iam_policy_document" "s3_handler_policy" {
  statement {
    sid    = "s3EventLambdaLogAccess"
    effect = "Allow"
    actions = [
      "logs:CreateLogGroup",
      "logs:CreateLogStream",
      "logs:PutLogEvents"
    ]
    resources = ["arn:aws:logs:*:*:*"]
  }
  statement {
    sid    = "s3EventLambdaXray"
    effect = "Allow"
    actions = [
      "xray:PutTraceSegments",
      "xray:PutTelemetryRecords"
    ]
    resources = ["*"]
  }
  statement {
    #tfsec:ignore:aws-iam-no-policy-wildcards
    sid    = "s3EventLambdaAllowDB"
    effect = "Allow"
    actions = [
      "dynamodb:BatchGetItem",
      "dynamodb:GetItem",
      "dynamodb:Query",
      "dynamodb:Scan",
      "dynamodb:BatchWriteItem",
      "dynamodb:PutItem",
      "dynamodb:UpdateItem",
      "dynamodb:GetRecords",
      "dynamodb:GetShardIterator",
      "dynamodb:DescribeStream",
      "dynamodb:ListStreams"
    ]
    resources = [
      aws_dynamodb_table.state_dynamodb_table.arn,
      "${aws_dynamodb_table.state_dynamodb_table.arn}/index/*",
      aws_dynamodb_table.state_dynamodb_table.stream_arn,
    ]
  }

  statement {
    sid    = "s3EventLambdaAllowBlacklistDB"
    effect = "Allow"
    actions = [
      "dynamodb:BatchGetItem",
      "dynamodb:GetItem",
      "dynamodb:Query",
      "dynamodb:Scan",
      "dynamodb:BatchWriteItem",
      "dynamodb:PutItem",
      "dynamodb:UpdateItem",
      "dynamodb:GetRecords",
      "dynamodb:GetShardIterator",
      "dynamodb:DescribeStream",
      "dynamodb:ListStreams"
    ]
    resources = [
      aws_dynamodb_table.blacklist_table.arn,
      "${aws_dynamodb_table.blacklist_table.arn}/index/*"
    ]
  }

  statement {
    sid       = "AllowListBucket"
    effect    = "Allow"
    actions   = ["s3:ListBucket", "s3:GetBucketLocation"]
    resources = [aws_s3_bucket.main_storage.arn]
  }

  # allow access to use data objects
  #tfsec:ignore:aws-iam-no-policy-wildcards
  statement {
    sid    = "AllowObjectAccess"
    effect = "Allow"
    actions = [
      "s3:PutObject",
      "s3:PutObjectAcl",
      "s3:GetObject",
      "s3:GetObjectAcl",
      "s3:DeleteObject"
    ]
    resources = [
      "${aws_s3_bucket.main_storage.arn}",
      "${aws_s3_bucket.main_storage.arn}/*"
    ]
  }

  statement {
    sid       = "AllowInvokingLambdas"
    effect    = "Allow"
    actions   = ["lambda:InvokeFunction"]
    resources = [aws_lambda_function.email_sender.arn]
  }

}

resource "aws_iam_policy" "s3_event_handler" {
  name   = "${local.site}-s3-event-handler-permissions"
  policy = data.aws_iam_policy_document.s3_handler_policy.json
}

resource "aws_iam_role_policy_attachment" "s3_event_handler" {
  role       = aws_iam_role.s3_event_handler_role.name
  policy_arn = aws_iam_policy.s3_event_handler.arn
}
