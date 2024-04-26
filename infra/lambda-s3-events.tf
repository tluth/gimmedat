data "archive_file" "s3_event_handler" {
  type        = "zip"
  output_path = "${path.module}/../backend/s3_event_handler_build.zip"
  source_dir  = "${path.module}/../backend/s3_event_handler"
}

resource "aws_lambda_function" "s3_event_handler" {
  function_name    = "${local.site}-s3-event-handler"
  role             = aws_lambda_function.api_lambda.role
  handler          = "s3_event_handler.new_object.lambda_handler"
  runtime          = var.lambda_runtime
  filename         = data.archive_file.s3_event_handler.output_path
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