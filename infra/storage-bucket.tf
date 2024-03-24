# add rules for TTL as well as download request limit for objects 

resource "aws_s3_bucket" "main_storage" {
  bucket = "${local.site}-file-storage"
}

resource "aws_s3_bucket_ownership_controls" "ownership" {
  bucket = aws_s3_bucket.main_storage.id
  rule {
    object_ownership = "BucketOwnerPreferred"
  }
}

resource "aws_s3_bucket_acl" "example" {
  depends_on = [aws_s3_bucket_ownership_controls.ownership]

  bucket = aws_s3_bucket.main_storage.id
  acl    = "private"
}

resource "aws_s3_bucket_public_access_block" "block_data_public_access" {
  bucket                  = aws_s3_bucket.main_storage.bucket
  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}

resource "aws_s3_bucket_cors_configuration" "data_cors_rules" {
  bucket = aws_s3_bucket.main_storage.bucket

  cors_rule {
    allowed_headers = ["*"]
    allowed_methods = ["GET", "DELETE", "PUT", "POST"]
    allowed_origins = flatten(["https://${local.product_domain}", "http://localhost:5000", "http://localhost:3000"])
    expose_headers  = ["ETag"]
    max_age_seconds = 3000
  }
}

resource "aws_s3_bucket_lifecycle_configuration" "my_s3_bucket_lifecycle_config" {
  bucket = aws_s3_bucket.main_storage.id
  depends_on = [ aws_s3_bucket.main_storage ]

  rule {
    id     = "2_day_lifecycle"
    status = "Enabled"

    abort_incomplete_multipart_upload {
      days_after_initiation = 1
    }

    expiration {
      days = 2
    }
  }
}

resource "aws_s3_bucket_server_side_encryption_configuration" "main" {
  bucket = aws_s3_bucket.main_storage.id

  rule {
    apply_server_side_encryption_by_default {
      sse_algorithm = "AES256"
    }
  }
}

resource "aws_s3_bucket_policy" "allow_ssl_only_policy" {
  bucket = aws_s3_bucket.main_storage.id
  policy = jsonencode({
    Version = "2012-10-17"
    Id      = "BUCKET-POLICY"
    Statement = [
      {
        Sid       = "EnforceTls"
        Effect    = "Deny"
        Principal = "*"
        Action    = "s3:*"
        Resource = [
          "${aws_s3_bucket.main_storage.arn}/*",
          "${aws_s3_bucket.main_storage.arn}"
        ]
        Condition = {
          Bool = {
            "aws:SecureTransport" = "false"
          }
        }
      }
    ]
  })
}
