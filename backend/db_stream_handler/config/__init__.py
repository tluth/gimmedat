import environ


@environ.config(prefix="")
class AuthConfig:
    # our code environment
    environment = environ.var(default="dev")
    aws_region = environ.var(default="eu-central-1")
    storage_bucket = environ.var(default="gimmedat-dev-file-storage")


# pull in config
appconfig: AuthConfig = AuthConfig().from_environ()
