#!/bin/env python3
#
#
#
#

import os
import sys

# Hack to use dependencies from lib directory
BASE_PATH = os.path.dirname(__file__)
# ensure our packages override the systems
sys.path.insert(0, BASE_PATH + "/lib")

#
# Our Internal deps
#
from config import appconfig  # nopep8
from iampolicy import AuthPolicy  # nopep8
from apitoken.tokenvalidate import validate_token  # nopep8
from oauth.azurevalidate import validate_azure  # nopep8
from apitoken.apimvalidate import validate_apim  # nopep8
from utils import extract_request_tenant  # nopep8

#
# Lambda + Observability Deps
#
#
from aws_lambda_powertools import Tracer, Logger  # nopep8
from aws_lambda_powertools.utilities.typing import LambdaContext  # nopep8
from aws_lambda_powertools.utilities.data_classes.api_gateway_authorizer_event import (
    APIGatewayAuthorizerEventV2,
)  # nopep8
from aws_lambda_powertools.utilities.data_classes import event_source  # nopep8

tracer = Tracer(service="api-authoriser")
logger = Logger(service="api-authoriser")


@ tracer.capture_lambda_handler
@ logger.inject_lambda_context(log_event=False, clear_state=True)
@ event_source(data_class=APIGatewayAuthorizerEventV2)
def lambda_handler(event: APIGatewayAuthorizerEventV2, context: LambdaContext):

    logger.debug("authorise", extra={"event": {
        "request_path": event.request_context.http.path,
        "identitySource": event.identity_source,
    }})

    # pull our tenant from the URL
    tenant = extract_request_tenant(event)
    logger.append_keys(tenant=tenant)

    # Request is from Azure API Management services
    if 'az-user-oid' in event.headers:
        resultantPolicy = validate_apim(tenant, event)
        if resultantPolicy:
            return resultantPolicy

    # are we using azure auth
    elif event.identity_source[0].startswith("Bearer"):
        resultantPolicy = validate_azure(tenant, event)
        if resultantPolicy:
            return resultantPolicy

    # token auth
    elif event.identity_source[0].startswith("Basic"):
        resultantPolicy = validate_token(tenant, event)
        if resultantPolicy:
            return resultantPolicy

    else:
        logger.error(f"unknown auth style detected", extra={
            "auth": event.identity_source[0]
        })

    # fall back to a default policy
    logger.warning(
        "unable to validate auth attempt, returning default policy ")
    policy = AuthPolicy("user|unknown", event.parsed_arn.aws_account_id)
    policy.restApiId = event.parsed_arn.api_id
    policy.region = event.parsed_arn.region
    policy.stage = event.parsed_arn.stage
    policy.denyAllMethods() if appconfig.auth_enabled else policy.allowAllMethods()

    return policy.build()
