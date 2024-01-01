from aws_lambda_powertools.utilities.data_classes.api_gateway_authorizer_event import (
    APIGatewayAuthorizerEventV2,
)
from aws_lambda_powertools import Tracer, Logger

#
# Our Internal deps
#
from iampolicy import AuthPolicy

tracer = Tracer(service="api-authoriser")
logger = Logger(service="api-authoriser", child=True)

# http.client.HTTPConnection.debuglevel = 1


@tracer.capture_method(capture_response=False)
def validate_apim(tenant: str, event: APIGatewayAuthorizerEventV2):

    logger.debug("validate_apim")

    authResponse = None
    errors = []

    logger.info("user was auth'd in Azure API Management services")

    if 'az-user-oid' not in event.headers:
        errors.append("User ID was not present in the request")
    elif tenant != event.headers.get("az-user-oid"):
        errors.append(
            f"Tenant ID {tenant} does not match the one in the request ({event.headers.get('az-user-oid')})")

    if 'az-user-email' not in event.headers:
        errors.append("Email address was not present in the request")
    elif not event.headers.get("az-user-email"):
        errors.append("Email address is empty")
    else:
        principalId = event.headers.get("az-user-email")

    if not errors:
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
            'principle': principalId,
            'roles': ["APIM User"],
            'authType': 'token',
            'tenant': str(tenant),
        }

        logger.info("APIM request is valid")
        authResponse['context'] = context

    else:
        logger.error("APIM request is invalid", extra={'errors': errors})

    return authResponse
