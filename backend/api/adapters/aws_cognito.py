import boto3
from pydantic import EmailStr


from ..models.users import ChangePassword, ConfirmForgotPassword, UserSignin, UserVerify
from ..config import appconfig


class AWS_Cognito:
    def __init__(self):
        self.client = boto3.client(
            "cognito-idp", region_name=appconfig.aws_region)

    def verify_account(self, data: UserVerify):
        response = self.client.confirm_sign_up(
            ClientId=appconfig.cognito_app_client_id,
            Username=data.email,
            ConfirmationCode=data.confirmation_code,
        )

        return response

    def resend_confirmation_code(self, email: EmailStr):
        response = self.client.resend_confirmation_code(
            ClientId=appconfig.cognito_app_client_id,
            Username=email
        )

        return response

    def check_user_exists(self, email: EmailStr):
        response = self.client.admin_get_user(
            UserPoolId=appconfig.cognito_user_pool_id,
            Username=email
        )

        return response

    def user_signin(self, data: UserSignin):
        response = self.client.initiate_auth(
            ClientId=appconfig.cognito_app_client_id,
            AuthFlow='USER_PASSWORD_AUTH',
            AuthParameters={
                'USERNAME': data.email,
                'PASSWORD': data.password
            }
        )

        return response

    def forgot_password(self, email: EmailStr):
        response = self.client.forgot_password(
            ClientId=appconfig.cognito_app_client_id,
            Username=email
        )

        return response

    def confirm_forgot_password(self, data: ConfirmForgotPassword):
        response = self.client.confirm_forgot_password(
            ClientId=appconfig.cognito_app_client_id,
            Username=data.email,
            ConfirmationCode=data.confirmation_code,
            Password=data.new_password
        )

        return response

    def change_password(self, data: ChangePassword):
        response = self.client.change_password(
            PreviousPassword=data.old_password,
            ProposedPassword=data.new_password,
            AccessToken=data.access_token,
        )

        return response

    def new_access_token(self, refresh_token: str):
        response = self.client.initiate_auth(
            ClientId=appconfig.cognito_app_client_id,
            AuthFlow='REFRESH_TOKEN_AUTH',
            AuthParameters={
                'REFRESH_TOKEN': refresh_token,
            }
        )

        return response

    def logout(self, access_token: str):
        response = self.client.global_sign_out(
            AccessToken=access_token
        )

        return response
