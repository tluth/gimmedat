resource aws_lambda_function "main" {
  depends_on = [ aws_api_gateway_rest_api.main ]

  function_name = "${module.this.id}-api"
  description   = "Main gimmedat REST API"
  handler       = "main.lambda_handler"
  runtime       = "python3.10"
  timeout       = var.api_lambda_timeout
  memory_size   = var.api_lambda_memory
  architectures = ["arm64"]
  publish = true
  # build_in_docker = true
  # docker_entrypoint = "/entrypoint/entrypoint.sh"
  # docker_file       = "${path.module}/lambda-builder/dockerfiles/python3.10_arm64.dockerfile"
  # docker_image      = "${module.this.id}-py3_10-arm64-build"

  filename = "../backend/api.zip"

  environment {
    variables =  {
    LOG_LEVEL                  = var.lambda_loglevel
    ENVIRONMENT                = local.environment
    PRODUCT                    = var.product
    DYNAMO_DB_TABLE     = module.dynamodb_table.table_name
  }
  }

  role = aws_iam_role.lambda_exec.arn
}

resource "aws_iam_role" "lambda_exec" {
  name = "api_lambda_execution"

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

data "aws_iam_policy_document" "api_lambda_permissions" {
  statement {
    sid= "lambdaExec"
    effect = "Allow"
    actions = [ "sts:AssumeRole" ]
    principals {
      type = "Service"
      identifiers = ["lambda.amazonaws.com"]
    }
  }

  statement {
    sid    = "DynamoDBIndexAccess"
    effect = "Allow"
    actions = [
      "dynamodb:GetShardIterator",
      "dynamodb:Scan",
      "dynamodb:Query",
      "dynamodb:GetItem",
      "dynamodb:DeleteItem",
      "dynamodb:UpdateItem",
      "dynamodb:PutItem"
    ]
    # namespaced to our product
    #tfsec:ignore:aws-iam-no-policy-wildcards
    resources = [
      module.dynamodb_table.table_arn,
      "${module.dynamodb_table.table_arn}/index/*"
    ]
  }
}
