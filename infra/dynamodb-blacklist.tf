resource "aws_dynamodb_table" "blacklist_table" {
  name         = "${local.site}-blacklist"
  hash_key     = "ip_address"
  billing_mode = "PAY_PER_REQUEST"

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
    name = "ip_address"
    type = "S"
  }
}
