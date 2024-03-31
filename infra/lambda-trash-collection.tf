# Logging 
resource "aws_cloudwatch_log_group" "dynamo_stream_logs" {
  name              = "/aws/lambda/${aws_lambda_function.db_stream_handler.function_name}"
  retention_in_days = 14
}

data "archive_file" "db_stream_handler" {
  type        = "zip"
  output_path = "${path.module}/../backend/db_stream_handler_build.zip"
  source_dir  = "${path.module}/../backend/db_stream_handler"
}

resource "aws_lambda_function" "db_stream_handler" {
    depends_on = [ aws_lambda_function.api_lambda ]
    role                           = aws_lambda_function.api_lambda.role
    runtime       = var.lambda_runtime
    function_name = "${local.site}-trash-collection"
    handler                        = "db_stream_handler.trash_collector.handler"
    filename                       = data.archive_file.db_stream_handler.output_path
}

resource "aws_lambda_event_source_mapping" "expire_item_mapping" {
  event_source_arn = aws_dynamodb_table.state_dynamodb_table.stream_arn
  function_name    = aws_lambda_function.db_stream_handler.function_name
  filter_criteria {
    filter {
      pattern = jsonencode({
        "userIdentity" : {
          "type" : ["Service"]
          "principalId" : ["dynamodb.amazonaws.com"]
        }
      })
    }
  }
  starting_position              = "LATEST"
  maximum_retry_attempts         = 1
  bisect_batch_on_function_error = true
  enabled                        = true
}