from .adapters.aws_cognito import AWS_Cognito


def get_aws_cognito() -> AWS_Cognito:
    return AWS_Cognito()
