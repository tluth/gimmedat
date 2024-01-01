
from __future__ import print_function, annotations
from aws_xray_sdk.core import patch
import json
from jwt import PyJWKClient, decode, ExpiredSignatureError
from aws_lambda_powertools.utilities.data_classes.api_gateway_authorizer_event import (
    APIGatewayAuthorizerEventV2,
)
from aws_lambda_powertools import Tracer, Logger
from aws_lambda_powertools.utilities import parameters

#
# Our Internal deps
#
from models.rolemappings import AzureRoleMapping
from iampolicy import AuthPolicy
from config import appconfig

# initialised on first use
jwks_client: PyJWKClient | None = None

tracer = Tracer(service="api-authoriser")
logger = Logger(service="api-authoriser", child=True)

# Finally hook in our tracing to
# support urllib https://github.com/aws/aws-xray-sdk-python/issues/149
patch(('httplib',))


@tracer.capture_method(capture_response=False)
def verify_token(token: str):

    logger.debug("verify_token")

    global jwks_client

    # Loop through the keys since we can't pass the key set to the decoder
    valid_token = False
    decoded_token = None

    azure_config = json.loads(parameters.get_secret(
        appconfig.azure_secret, max_age=300))

    logger.debug({
        "TENANT_ID": azure_config.get('TENANT_ID'),
        "CLIENT_ID": azure_config.get('CLIENT_ID'),
        "CLIENT_SECRET": "***"
    })

    if jwks_client is None:
        # caching client
        CERT_URL = f"https://login.microsoftonline.com/{azure_config.get('TENANT_ID')}/discovery/v2.0/keys"
        jwks_client = PyJWKClient(CERT_URL)

    try:
        signing_key = jwks_client.get_signing_key_from_jwt(token)

        logger.debug(signing_key)

        # decode returns the claims that has the email when needed
        decoded_token = decode(
            token, key=signing_key.key, audience=azure_config.get('CLIENT_ID'), leeway=10, algorithms=['RS256'])

        logger.debug(decoded_token)

        valid_token = True

    except ExpiredSignatureError:
        logger.error("expired token")
    except:
        logger.exception("error validating token")
        pass

    return valid_token, decoded_token


@tracer.capture_method(capture_response=False)
def validate_azure(tenant: str, event: APIGatewayAuthorizerEventV2):

    logger.debug("validate_azure")

    authResponse = None

    token = event.identity_source[0][len("Bearer "):]

    logger.info("validating azure auth attempt")

    (valid_token, decoded_token) = verify_token(token)

    if valid_token:

        # now we have a valid token
        principalId = decoded_token['preferred_username']

        logger.info("token valid, looking up role", extra={
            "uid": decoded_token['oid']
        })

        principle_roles = []

        # First process roles in assigned from JWT/Azure App
        if "roles" in decoded_token:

            for role in decoded_token["roles"]:
                # do we have a tenant delimited role
                # i.e. 12ec4cee-d13c-482a-b222-ae8032e9c611_admin
                if role.find("_") >= 0:
                    # if role is valid for our tenant
                    r_tenant, r_role = role.split("_")
                    if r_tenant == tenant:
                        principle_roles.append(r_role)
                else:
                    # just append the role
                    principle_roles.append(role)

        try:
            valid_user_mapping = False

            if tenant == appconfig.default_tenant:
                # a tenant ID was not included in the URL
                # split the url to see what endpoint is being called
                parts = event.request_context.http.path.lower().split('/')
                if len(parts) >= 4:
                    # part 1 - should be version, not required here
                    # part 2 - route prefix
                    # part 3 - operation
                    if (event.request_context.http.method == "GET"
                        and parts[2] == "tenant"
                            and parts[3] == "list"):

                        logger.info("Getting tenant list - authorise")
                        role = "Individual"
                        valid_user_mapping = True

            elif tenant == decoded_token['oid']:
                logger.info("Tenant matches oid - authorise")
                role = "Individual"
                valid_user_mapping = True

            else:
                # Now lookup any explicitly assign roles in the DB
                user_map = AzureRoleMapping()

                user_map.setup_model(
                    AzureRoleMapping,
                    region=appconfig.aws_region,
                    table_name=appconfig.dynamodb_tablename
                )

                user_mapping = user_map.get(tenant, decoded_token['oid'])

                if not user_mapping.active:
                    logger.error("user not active", extra={
                        "uid": decoded_token['oid']
                    })
                else:
                    logger.info("Found active user mapping - authorise")
                    role = user_mapping.role
                    principle_roles.append(user_mapping.role)
                    valid_user_mapping = True

            if valid_user_mapping:

                logger.info("user->role mapping found - access granted", extra={
                    "uid": decoded_token['oid'],
                    "role": role,
                    "principalId": principalId,
                })

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
                    'roles': principle_roles,
                    'authType': 'azure',
                    'tenant': str(tenant),
                }

                authResponse['context'] = context

        except AzureRoleMapping.DoesNotExist:
            logger.warning("user -> role mapping does not exist", extra={
                "uid": decoded_token['oid']
            })

    return authResponse
