resource "aws_dynamodb_table" "state_dynamodb_table" {
  name         = local.file_storage_table_name
  hash_key     = "file_id"
  range_key    = "s3_path" 
  billing_mode = "PAY_PER_REQUEST"

  stream_enabled   = true
  stream_view_type = "NEW_AND_OLD_IMAGES"

  ttl {
    attribute_name = "expire_at"
    enabled        = true
  }

  point_in_time_recovery {
    enabled = true
  }

  server_side_encryption {
    enabled = true
  }

  attribute {
    name = "file_id"
    type = "S"
  }
  attribute {
    name = "s3_path"
    type = "S"
  }
}
