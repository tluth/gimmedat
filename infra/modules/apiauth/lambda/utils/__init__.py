
from aws_lambda_powertools.utilities.data_classes.api_gateway_authorizer_event import (
    APIGatewayAuthorizerEventV2,
)
from aws_lambda_powertools import Logger
from uuid import UUID

#
# Our Internal deps
#
from config import appconfig

#
UUID_VERSION = 4

logger = Logger(service="api-authoriser", child=True)


def extract_request_tenant(event: APIGatewayAuthorizerEventV2) -> str:
    """
        We assume the tenant is passed as a UUID v4 path prefix to the API
        i.e. /v1/ea1a3382-893b-48e0-a331-a52eb044439c/extract/submit.

        If a tenant prefix isn't pass we fall back on a default tenant.
    """
    logger.debug("extract_request_tenant")

    # set our default tenant
    default_tenant = appconfig.default_tenant

    # pull our path from the event
    request_path = event.request_context.http.path

    # split out the path extracting the 2nd component (should be the tenant)
    tenant = request_path.split('/')[2]

    # if we've been passed a path
    if tenant != '':
        try:
            # validate its a UUID
            UUID(tenant, version=UUID_VERSION)
        except ValueError:
            logger.debug(
                f"{tenant} is not a valid uuid - returning default tenant")
            return default_tenant

        #
        return tenant

    logger.debug(f"Tenant not found - returning default tenant")
    return default_tenant


def obfuscate_token(token):
    """
        simple function to display a fragment of the token
    """
    #
    view_size = len("adp_") + 5

    return f"{token[:view_size]}******"
