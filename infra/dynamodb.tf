module "dynamodb_table" {
  source = "cloudposse/dynamodb/aws"

  context    = module.this.context
  attributes = ["config"]

  hash_key      = "PK"
  hash_key_type = "S"

  range_key      = "SK"
  range_key_type = "N"

  global_secondary_index_map = [
    {
      name               = "LatestVersionIndex"
      hash_key           = "SK"
      range_key          = "PK"
      projection_type    = "ALL"
      write_capacity     = null
      read_capacity      = null
      non_key_attributes = null
    }
  ]

  billing_mode                  = "PAY_PER_REQUEST"
  enable_point_in_time_recovery = true
}
