module "api_gateway_account_settings" {
  source  = "cloudposse/api-gateway/aws//modules/account-settings"
  # version = "x.x.x"

  context = module.this.context
}

module "api_gateway" {
  source = "../../"

  openapi_config = {
    openapi = "3.0.1"
    info = {
      title   = "example"
      version = "1.0"
    }
    paths = {
      "/path1" = {
        get = {
          x-amazon-apigateway-integration = {
            httpMethod           = "GET"
            payloadFormatVersion = "1.0"
            type                 = "HTTP_PROXY"
            uri                  = "https://ip-ranges.amazonaws.com/ip-ranges.json"
          }
        }
      }
    }
  }
  logging_level = var.logging_level
  context       = module.this.context
}