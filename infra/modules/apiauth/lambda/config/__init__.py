
import environ


@environ.config(prefix='')
class AuthConfig:
    # our code environment
    env = environ.var(default="dev")
    # fallback tenant for backwards compat
    default_tenant = environ.var()
    # AWS secret containing our azure app creds
    azure_secret = environ.var()
    # dynamodb table to use
    dynamodb_tablename = environ.var()
    # our default AWS region
    aws_region = environ.var(default="eu-west-1")
    # auth enabled
    auth_enabled = environ.var(converter=bool, default=True)


# pull in config
appconfig: AuthConfig = AuthConfig().from_environ()
