resource "aws_secretsmanager_secret" "api_auth_azure_secret" {
  name                    = "/${local.tenant}/${local.product}/${local.environment}/api/auth/azure"
  description             = "Azure Secrets for API Auth"
  recovery_window_in_days = 0
}

resource "aws_secretsmanager_secret_version" "azure_oauth_client_secret" {
  secret_id = aws_secretsmanager_secret.api_auth_azure_secret.id
  secret_string = jsonencode(
    {
      TENANT_ID     = var.azure_oauth_tenant_id
      CLIENT_ID     = var.azure_oauth_client_id
      CLIENT_SECRET = var.azure_oauth_client_secret
    }
  )
}