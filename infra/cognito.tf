resource "aws_cognito_user_pool" "main" {
  name                = "${local.site}-main"
  mfa_configuration   = "ON"
  username_attributes = ["email"]

  admin_create_user_config {
    allow_admin_create_user_only = true

  }

  software_token_mfa_configuration {
    enabled = true
  }

  email_configuration {
    email_sending_account = "DEVELOPER"
    from_email_address    = "no-reply@${local.product_domain}"
    source_arn            = aws_ses_domain_identity.sesid.arn
  }

  account_recovery_setting {
    recovery_mechanism {
      name     = "verified_email"
      priority = 1
    }
  }

  password_policy {
    temporary_password_validity_days = 7
    minimum_length    = 8
    require_lowercase = true
    require_uppercase = true
    require_numbers   = true
    require_symbols   = true
  }

  verification_message_template {
    default_email_option = "CONFIRM_WITH_CODE"
    email_subject        = "Account Confirmation"
    email_message        = "Your confirmation code is {####}"
  }

  schema {
    attribute_data_type      = "String"
    developer_only_attribute = false
    mutable                  = true
    name                     = "email"
    required                 = true

    string_attribute_constraints {
      min_length = 1
      max_length = 256
    }
  }

  lambda_config {
    post_confirmation = data.aws_ssm_parameter.post_confirmation_lambda_arn.value
  }
}

resource "aws_ssm_parameter" "user_pool_arn" {
  name  = "/gimmedat/cognito/user_pool_arn"
  description     = "main user pool for gimmedat"
  type  = "String"
  value = aws_cognito_user_pool.main.arn
}

resource "aws_ssm_parameter" "user_pool_id" {
  name  = "/gimmedat/cognito/user_pool_id"
  description     = "main user pool for gimmedat"
  type  = "String"
  value = aws_cognito_user_pool.main.id
}

resource "aws_cognito_user_pool_client" "client" {
  name = "${local.site}-main-client"

  user_pool_id                  = aws_cognito_user_pool.main.id
  generate_secret               = false
  refresh_token_validity        = 90
  prevent_user_existence_errors = "ENABLED"
  enable_token_revocation       = true
  explicit_auth_flows = [
    "ALLOW_REFRESH_TOKEN_AUTH",
    "ALLOW_USER_SRP_AUTH",
  ]
  callback_urls                        = ["https://${local.product_domain}", "http://localhost:3000"]
  logout_urls                          = ["https://${local.product_domain}", "http://localhost:3000"]
  allowed_oauth_flows_user_pool_client = true
  allowed_oauth_flows                  = ["code", "implicit"]
  allowed_oauth_scopes                 = ["email", "openid", "profile"]
  supported_identity_providers         = ["COGNITO"]
}

resource "aws_cognito_user_pool_domain" "cognito-domain" {
  domain       = "${local.site}-auth"
  user_pool_id = aws_cognito_user_pool.main.id
  # certificate_arn = module.acm_request_certificate.arn
}
