module "dynamodb_auth_table" {
  source = "../../vendor/modules/terraform-aws-dynamodb"

  context    = module.this.context
  attributes = ["auth"]

  hash_key  = "PK"
  range_key = "SK"

  dynamodb_attributes = [
    {
      name = "PK"
      type = "S"
    },
    {
      name = "SK"
      type = "S"
    },
    {
      name = "principle"
      type = "S"
    },
  ]

  global_secondary_index_map = [
    {
      name               = "principle-index"
      hash_key           = "principle"
      range_key          = null
      projection_type    = "ALL"
      read_capacity      = null
      write_capacity     = null
      non_key_attributes = []
    },
  ]

  billing_mode                  = "PAY_PER_REQUEST"
  enable_point_in_time_recovery = true

  ttl_enabled   = true
  ttl_attribute = "Expires"
}


