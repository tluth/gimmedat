# custom domain for API
module "acm_api_certificate" {
  source = "./vendor/modules/cloudposse/terraform-aws-acm-request-certificate"
  providers = {
    aws = aws.us_east_1
  }
  domain_name                       = local.product_domain_api
  name                              = "${local.product_domain}-api-acm"
  zone_id                           = data.aws_route53_zone.zone.id
  process_domain_validation_options = true
  ttl                               = "300"
}

resource "aws_api_gateway_domain_name" "api_domain" {
  depends_on      = [module.acm_api_certificate]
  domain_name     = local.product_domain_api
  certificate_arn = module.acm_api_certificate.arn
  security_policy = "TLS_1_2"
}

resource "aws_api_gateway_base_path_mapping" "mapping" {
  api_id      = aws_api_gateway_rest_api.api.id
  stage_name  = aws_api_gateway_stage.api_stage.stage_name
  domain_name = aws_api_gateway_domain_name.api_domain.domain_name
}

resource "aws_route53_record" "api_domain_name" {
  zone_id = data.aws_route53_zone.zone.id
  name    = "api.${var.product}"
  type    = "CNAME"
  ttl     = 60
  records = [aws_api_gateway_domain_name.api_domain.cloudfront_domain_name]
}

# API
resource "aws_api_gateway_rest_api" "api" {
  name = local.site
  endpoint_configuration {
    types = ["REGIONAL"]
  }
}

resource "aws_api_gateway_deployment" "api_deployment" {
  rest_api_id = aws_api_gateway_rest_api.api.id

  lifecycle {
    create_before_destroy = false
  }

  depends_on = [
    aws_api_gateway_integration.api_proxy_integration,
  ]
}

resource "aws_api_gateway_stage" "api_stage" {
  # checkov:skip=CKV2_AWS_29:WAF not needed for non-prod use
  deployment_id = aws_api_gateway_deployment.api_deployment.id
  rest_api_id   = aws_api_gateway_rest_api.api.id
  stage_name    = local.environment
  cache_cluster_enabled = false
  xray_tracing_enabled = false
}

resource "aws_api_gateway_usage_plan" "throttle" {
  name         = "${local.site}-usage-plan"

  api_stages {
    api_id = aws_api_gateway_rest_api.api.id
    stage  = aws_api_gateway_stage.api_stage.stage_name
  }

  throttle_settings {
    burst_limit = 5
    rate_limit  = 10
  }
}


resource "aws_api_gateway_resource" "api_gateway_resource" {
  rest_api_id = aws_api_gateway_rest_api.api.id
  parent_id   = aws_api_gateway_rest_api.api.root_resource_id
  path_part   = "{proxy+}"
}

module "api-gateway-enable-cors" {
  source          = "squidfunk/api-gateway-enable-cors/aws"
  version         = "0.3.3"
  api_id          = aws_api_gateway_rest_api.api.id
  api_resource_id = aws_api_gateway_resource.api_gateway_resource.id
}

resource "aws_api_gateway_method" "api_gateway_root_method" {
  rest_api_id   = aws_api_gateway_rest_api.api.id
  resource_id   = aws_api_gateway_resource.api_gateway_resource.id
  http_method   = "ANY"
  authorization = "NONE"
  request_parameters = {
    "method.request.path.proxy" = true
  }
}


resource "aws_api_gateway_method_settings" "api_gateway_method_settings" {
  rest_api_id = aws_api_gateway_rest_api.api.id
  stage_name  = aws_api_gateway_stage.api_stage.stage_name
  method_path = "*/*"

  settings {
    caching_enabled = false
    # metrics_enabled = true
    # logging_level   = "ERROR"
  }

}

resource "aws_api_gateway_integration" "api_proxy_integration" {
  rest_api_id             = aws_api_gateway_rest_api.api.id
  resource_id             = aws_api_gateway_resource.api_gateway_resource.id
  http_method             = aws_api_gateway_method.api_gateway_root_method.http_method
  integration_http_method = "POST"
  type                    = "AWS_PROXY"
  uri                     = aws_lambda_function.api_lambda.invoke_arn
}

# Allow the API gateway to invoke this lambda function
resource "aws_lambda_permission" "api_lambda_permission" {
  statement_id  = "AllowExecutionFromAPIGateway"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.api_lambda.function_name
  principal     = "apigateway.amazonaws.com"
  source_arn    = "${aws_api_gateway_rest_api.api.execution_arn}/*/*/*"
}

# Logging
resource "aws_cloudwatch_log_group" "api_logs" {
  name              = "/aws/lambda/${aws_lambda_function.api_lambda.function_name}"
  retention_in_days = 14
}

# Lambda
data "archive_file" "lambda_zip" {
  type        = "zip"
  output_path = "${path.module}/../backend/api_build.zip"
  source_dir  = "${path.module}/../backend/api"
}

resource "aws_lambda_function" "api_lambda" {
  role                           = aws_iam_role.api_role.arn
  function_name                  = "${local.site}"
  timeout                        = 300
  memory_size                    = 512
  reserved_concurrent_executions = 50
  handler                        = "api.run_api.handler"
  runtime                        = var.lambda_runtime
  filename                       = data.archive_file.lambda_zip.output_path

  environment {
    variables = {
      "REGION" = local.aws_region
      "STORAGE_BUCKET" = var.file_storage_bucket
      "FILE_SIZE_LIMIT" = var.file_size_limit
    }
  }
}

### DynamoDB & S3 permissions
resource "aws_iam_policy" "extra_perms" {
  name   = "${local.site}-api-permissions"
  policy = data.aws_iam_policy_document.extra_perms.json
}

resource "aws_iam_role_policy_attachment" "extra_perms" {
  role       = aws_iam_role.api_role.name
  policy_arn = aws_iam_policy.extra_perms.arn
}

data "aws_iam_policy_document" "extra_perms" {
  # namespaced to only our table
  #tfsec:ignore:aws-iam-no-policy-wildcards
  statement {
    sid    = "AllowDB"
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
    sid    = "AllowBlacklistDB"
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
}

resource "aws_iam_role_policy" "iam_role_policy" {
  role   = aws_iam_role.api_role.name
  policy = <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
      {
        "Sid": "AllowXRay",
        "Resource": "*",
        "Action": [
            "xray:PutTraceSegments",
            "xray:PutTelemetryRecords"
        ],
        "Effect": "Allow"
      },
      {
        "Effect": "Allow",
        "Action": [
            "logs:CreateLogGroup",
            "logs:CreateLogStream",
            "logs:PutLogEvents"
        ],
        "Resource": "arn:aws:logs:*:*:*"
      },
      {
        "Effect": "Allow",
        "Action": "lambda:InvokeFunction",
        "Resource": "*"
      }
  ]
  }
EOF
}


resource "aws_iam_role" "api_role" {
  name               = "iam-${local.site}-lambda-role"
  assume_role_policy = <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
      {
          "Sid": "",
          "Effect": "Allow",
          "Principal": {
              "Service": "apigateway.amazonaws.com"
          },
          "Action": "sts:AssumeRole"
      },
      {
          "Action": "sts:AssumeRole",
          "Principal": {
              "Service": "lambda.amazonaws.com"
          },
          "Effect": "Allow",
          "Sid": ""
      },
      {
          "Sid": "",
          "Effect": "Allow",
          "Principal": {
              "Service": "ecs-tasks.amazonaws.com"
          },
          "Action": "sts:AssumeRole"
      }
  ]
}
EOF
}
