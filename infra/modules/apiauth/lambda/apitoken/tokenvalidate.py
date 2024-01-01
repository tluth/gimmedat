
import pytz
from datetime import datetime

from aws_lambda_powertools.utilities.data_classes.api_gateway_authorizer_event import (
    APIGatewayAuthorizerEventV2,
)
from aws_lambda_powertools import Tracer, Logger

#
# Our Internal deps
#
from models.rolemappings import TokenRoleMapping
from iampolicy import AuthPolicy
from utils import obfuscate_token
from config import appconfig
from .base62token import Base62Token

tracer = Tracer(service="api-authoriser")
logger = Logger(service="api-authoriser", child=True)

# http.client.HTTPConnection.debuglevel = 1


@tracer.capture_method(capture_response=False)
def validate_token(tenant: str, event: APIGatewayAuthorizerEventV2):

    logger.debug("validate_token")

    authResponse = None

    logger.info("using basic/token auth")

    user_token = event.identity_source[0][len("Basic "):]

    # first validate the token is in the correct form
    b62token = Base62Token()

    if not b62token.verify(user_token):
        logger.error("cannot validate token, incorrect format")
        return authResponse

    # now lookup the token
    token_map = TokenRoleMapping()

    token_map.setup_model(
        TokenRoleMapping,
        region=appconfig.aws_region,
        table_name=appconfig.dynamodb_tablename
    )

    try:
        token_mapping = token_map.get(tenant, user_token)

        valid_token = True

        if not token_mapping.active:
            logger.error("token not active", extra={
                "token": obfuscate_token(user_token)
            })
            valid_token = False

        if token_mapping.expires < datetime.now().replace(tzinfo=pytz.UTC):
            logger.error("token expired", extra={
                "token": obfuscate_token(user_token)
            })
            valid_token = False

        if valid_token:
            logger.info("token -> role mapping found  - access granted", extra={
                "token": obfuscate_token(user_token),
                "role": token_mapping.role
            })

            # now we have a valid token
            principalId = token_mapping.principle

            policy = AuthPolicy(
                principalId, event.parsed_arn.aws_account_id
            )
            policy.restApiId = event.parsed_arn.api_id
            policy.region = event.parsed_arn.region
            policy.stage = event.parsed_arn.stage
            policy.allowAllMethods()

            # Finally, build the policy
            authResponse = policy.build()

            context = {
                'principle': token_mapping.principle,
                'roles': [token_mapping.role],
                'authType': 'token',
                'tenant': str(tenant),
            }

            authResponse['context'] = context

    except TokenRoleMapping.DoesNotExist:
        logger.warning("api token does not exist")

    return authResponse
