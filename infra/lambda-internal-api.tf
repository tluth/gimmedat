module "internal_api_lambda" {
  source = "./vendor/modules/terraform-aws-lambda"

  function_name = "${module.this.id}-internal-api"
  description   = "Internal Geo API"
  handler       = "api.lambda_handler"
  runtime       = "python3.10"
  timeout       = var.internal_api_lambda_timeout
  memory_size   = var.internal_api_lambda_memory
  architectures = ["arm64"]

  build_in_docker = true
  docker_entrypoint = "/entrypoint/entrypoint.sh"
  docker_file       = "${path.module}/lambda-builder/dockerfiles/python3.10_arm64.dockerfile"
  docker_image      = "${module.this.id}-py3_10-arm64-build"

  source_path = [
    {
      path             = "${path.module}/lambdas/internal-api"
      pip_requirements = true
    }
  ]

  vpc_subnet_ids         = data.aws_subnets.private.ids
  vpc_security_group_ids = [aws_security_group.internal_api_lambda_sg.id]
  attach_network_policy  = true
  attach_policy_json     = true
  policy_json            = data.aws_iam_policy_document.internal_api_lambda_permissions.json

  tracing_mode          = "Active"
  attach_tracing_policy = true

  cloudwatch_logs_retention_in_days = var.lambda_log_retention

  create_current_version_allowed_triggers = false
  allowed_triggers = {
    AllowExecutionFromAPIGateway = {
      service    = "apigateway"
      source_arn = "${data.aws_ssm_parameter.geo_internal_api_arn.value}/*/*"
    }
  }

  environment_variables = {
    LOG_LEVEL                  = var.lambda_loglevel
    ENVIRONMENT                = local.environment
    PRODUCT                    = var.product
    DYNAMO_DB_TABLE     = module.dynamodb_config_table.table_name
  }

  recreate_missing_package = false
  ignore_source_code_hash  = true
  hash_extra               = "${local.geo_transform_api_version}-${local.adp_otel_version}"
}

resource "aws_security_group" "internal_api_lambda_sg" {
  name        = "${module.this.id}-internal-api-sg"
  description = "FME Extract Lambda"
  vpc_id      = data.aws_vpc.vpc.id

  tags = {
    Name = "${module.this.id}-internal-api-sg"
  }
}

resource "aws_security_group_rule" "internal_api_lambda_egress_https" {
  security_group_id = aws_security_group.internal_api_lambda_sg.id
  description       = "Allow HTTPS outbound"

  type        = "egress"
  from_port   = 443
  to_port     = 443
  protocol    = "tcp"
  cidr_blocks = ["0.0.0.0/0"]
}

resource "aws_security_group_rule" "internal_api_lambda_egress_otel" {
  security_group_id = aws_security_group.internal_api_lambda_sg.id
  description       = "Allow Otel Egress"

  type        = "egress"
  from_port   = 4317
  to_port     = 4317
  protocol    = "tcp"
  cidr_blocks = ["0.0.0.0/0"]
}

data "aws_iam_policy_document" "internal_api_lambda_permissions" {

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
      module.dynamodb_transformations_table.table_arn,
      "${module.dynamodb_transformations_table.table_arn}/index/*",
      module.dynamodb_config_table.table_arn,
      "${module.dynamodb_config_table.table_arn}/index/*",
    ]
  }

  statement {
    sid = "AllowAccessMWAA"

    actions = [
      "airflow:CreateCliToken"
    ]

    resources = [data.aws_ssm_parameter.geo_airflow_arn.value]
  }

  statement {
    sid    = "EventsPutPermissions"
    effect = "Allow"

    actions = [
      "events:PutEvents"
    ]
    resources = ["arn:aws:events:${local.aws_region}:${data.aws_caller_identity.current.account_id}:event-bus/default"]
  }

  statement {
    sid    = "AllowLambdaSecretsAccess"
    effect = "Allow"
    actions = [
      "secretsmanager:GetResourcePolicy",
      "secretsmanager:GetSecretValue",
      "secretsmanager:DescribeSecret",
      "secretsmanager:ListSecretVersionIds"
    ]

    resources = ["arn:aws:secretsmanager:${local.aws_region}:${data.aws_caller_identity.current.account_id}:secret:/adp/fme/${local.environment}/fme/fme-job-runner-token-*"]
  }

  statement {
    sid    = "AllowExecuteApi"
    effect = "Allow"
    actions = [
      "execute-api:Invoke"
    ]

    resources = [
      "${data.aws_ssm_parameter.geo_internal_api_arn.value}/*/*/*",
    ]
  }
}

resource "aws_apigatewayv2_integration" "internal_integration" {
  api_id = data.aws_ssm_parameter.geo_internal_api_id.value

  integration_type       = "AWS_PROXY"
  integration_uri        = module.internal_api_lambda.lambda_function_arn
  connection_type        = "INTERNET"
  payload_format_version = "2.0"
  timeout_milliseconds   = var.internal_api_lambda_timeout * 1000

  lifecycle {
    create_before_destroy = true
  }
}

resource "aws_apigatewayv2_route" "internal_post_route" {
  api_id             = data.aws_ssm_parameter.geo_internal_api_id.value
  route_key          = "POST /transform/{proxy+}"
  authorization_type = "AWS_IAM"
  target             = "integrations/${aws_apigatewayv2_integration.internal_integration.id}"
}

resource "aws_apigatewayv2_route" "internal_get_route" {
  api_id             = data.aws_ssm_parameter.geo_internal_api_id.value
  route_key          = "GET /transform/{proxy+}"
  authorization_type = "AWS_IAM"
  target             = "integrations/${aws_apigatewayv2_integration.internal_integration.id}"
}

resource "aws_apigatewayv2_route" "internal_patch_route" {
  api_id             = data.aws_ssm_parameter.geo_internal_api_id.value
  route_key          = "PATCH /transform/{proxy+}"
  authorization_type = "AWS_IAM"
  target             = "integrations/${aws_apigatewayv2_integration.internal_integration.id}"
}
