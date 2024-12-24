from pydantic_settings import BaseSettings
from pydantic.types import Any
from . import appconfig

class Settings(BaseSettings):
    check_expiration: bool = True
    jwt_header_prefix: str = "Bearer"
    jwt_header_name: str = "Authorization"
    userpools: dict[str, dict[str, Any]] = {
        "default": {
            "region": appconfig.aws_region,
            "userpool_id": appconfig.cognito_user_pool_id,
            "app_client_id": appconfig.cognito_app_client_id
        }
    }

authconfig = Settings()