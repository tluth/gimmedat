import environ


@environ.config(prefix="")
class AuthConfig:
    # our code environment
    environment = environ.var(default="dev")
    aws_region = environ.var(default="eu-central-1")
    files_table_name = environ.var(default="gimmedat-dev-files")
    file_size_limit = environ.var(default=1073741824, help="max file size limit for uploads in bytes")
    storage_bucket = environ.var(default="gimmedat-dev-file-storage")
    frontend_base_domain = environ.var(default="https://gimmedat.bulgingdiscs.fun")


# pull in config
appconfig: AuthConfig = AuthConfig().from_environ()
