import environ


@environ.config(prefix="")
class AuthConfig:
    # our code environment
    environment = environ.var(default="dev")
    region = environ.var(default="eu-central-1")
    domain = environ.var(default="gimmedat.bulgingdiscs.fun")


# pull in config
appconfig: AuthConfig = AuthConfig().from_environ()
