
data "aws_iam_policy_document" "ghaction_backend_statements" {

  statement {
    sid    = "AllowLambdaAccess"
    effect = "Allow"
    actions = [
      "lambda:UpdateFunctionCode",
      "lambda:UpdateFunctionConfiguration"
    ]
    resources = [
      aws_lambda_function.api_lambda.arn,
      aws_lambda_function.db_stream_handler.arn,
      aws_lambda_function.s3_event_handler.arn
    ]
  }
}

resource "aws_iam_role_policy" "ghaction_backend" {
  name   = "${module.this.id}-ghaction-backend-policy"
  role   = aws_iam_role.ghaction_backend_role.name
  policy = data.aws_iam_policy_document.ghaction_backend_statements.json
}

resource "aws_iam_role" "ghaction_backend_role" {
  name                 = "${module.this.id}-backend-ghaction"
  assume_role_policy   = data.aws_iam_policy_document.ghaction_assume_role.json
  description          = "The IAM role used to push the backend from github actions"
  max_session_duration = 3600
  path                 = "/github-service-roles/"
}

