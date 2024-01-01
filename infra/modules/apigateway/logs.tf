resource "aws_cloudwatch_log_group" "api" {
  name              = "${var.cw_log_group_prefix}/api/${var.name_suffix}"
  retention_in_days = var.cw_logs_retention_period
}
