import environ


@environ.config(prefix="")
class AuthConfig:
    # our code environment
    environment = environ.var(default="dev")
    aws_region = environ.var(default="eu-central-1")
    files_table_name = environ.var(default="gimmedat-dev-files")
    blacklist_table_name = environ.var(default="gimmedat-dev-blacklist")
    file_size_limit = environ.var(
        default=4294967296,
        help="max file size limit for uploads in bytes")
    storage_bucket = environ.var(default="gimmedat-dev-file-storage")
    frontend_base_domain = environ.var(
        default="https://gimmedat.bulgingdiscs.fun")
    cognito_app_client_id = environ.var(default="24i0v6tkh4258o858fvt7mo0ak")
    cognito_user_pool_id = environ.var(default="eu-central-1_TOWhnk8hl")


# pull in config
appconfig: AuthConfig = AuthConfig().from_environ()
