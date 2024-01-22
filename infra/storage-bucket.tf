# add rules for TTL as well as download request limit for objects 

resource "aws_s3_bucket" "main_storage" {
  bucket = "${local.environment}-${local.product_domain}-file-storage"
}