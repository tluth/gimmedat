from fastapi_cognito import CognitoAuth, CognitoSettings

from api.config.auth_config import authconfig

cognito_default = CognitoAuth(
    settings=CognitoSettings.from_global_settings(authconfig)
)
