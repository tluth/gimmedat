
data "aws_iam_policy_document" "api_auth_lambda_permissions" {
  statement {
    sid    = "AllowLambdaSecretsAccess"
    effect = "Allow"
    actions = [
      "secretsmanager:GetResourcePolicy",
      "secretsmanager:GetSecretValue",
      "secretsmanager:DescribeSecret",
      "secretsmanager:ListSecretVersionIds"
    ]

    resources = ["arn:aws:secretsmanager:${data.aws_region.current.name}:${data.aws_caller_identity.current.account_id}:secret:/${local.tenant}/${local.product}/${local.environment}/api/auth/*"]
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
    # low privilege actions
    #tfsec:ignore:aws-iam-no-policy-wildcards
    resources = [
      module.dynamodb_auth_table.table_arn,
      "${module.dynamodb_auth_table.table_arn}/index/*",
    ]
  }
}

module "lambda_api_authorizer" {
  source = "../../vendor/modules/terraform-aws-lambda"

  function_name = "${module.this.id}-api-auth"
  description   = "API Authenticator"
  handler       = "auth.lambda_handler"
  runtime       = "python3.9"
  timeout       = var.lambda_timeout
  memory_size   = var.lambda_memory
  architectures = ["arm64"]

  build_in_docker   = true
  docker_file       = "${path.module}/docker/Dockerfile"
  docker_build_root = "${path.module}/lambda"
  docker_image      = "${module.this.id}-api-auth-build"

  source_path = [
    {
      path             = "${path.module}/lambda",
      pip_requirements = true
    }
  ]

  attach_policy_json = true
  policy_json        = data.aws_iam_policy_document.api_auth_lambda_permissions.json

  tracing_mode          = "Active"
  attach_tracing_policy = true

  cloudwatch_logs_retention_in_days = var.lambda_log_retention

  create_current_version_allowed_triggers = false

  environment_variables = {
    LOG_LEVEL          = var.lambda_loglevel
    AZURE_SECRET       = aws_secretsmanager_secret.api_auth_azure_secret.name
    DEFAULT_TENANT     = var.auth_default_tenant
    DYNAMODB_TABLENAME = module.dynamodb_auth_table.table_name
  }

  recreate_missing_package = false
  ignore_source_code_hash  = true
}

