
# ADP API authorisor

ADP API authorisor - wraps API in a authorisation layer allowing mapping of Azure or API credentials to a set of authorisation context.

The authorisation context is then passed onto the API which can then use as the basis of permissions based access to services.

![hl-design](media/authz-hl.png ':size=75%')

## Oauth2 Secret Configuration

oauth2 authorisation is done against a Azure Enterprise App. To achieve this the AWS secret referenced in the `AZURE_SECRET` must be manually populated with valid client id credentials from a azure app registration.

A sample configuration:

```json
{
	"TENENT_ID": "4ae48b41-0137-4599-8661-fc641fe77bea",
	"CLIENT_ID": "d8cf2551-1d16-4e9e-9ab8-a4b1d19d9459",
	"CLIENT_SECRET": "aaabbbccc"
}
```
* TENENT_ID - The azure tenant - always `4ae48b41-0137-4599-8661-fc641fe77bea` for arup.

* CLIENT_ID - The enterprise app id - found in the overview section of the app registration under "Application (client) ID"

* CLIENT_SECRET - The client secret is generated in the "Certificates & Secrets" section of the chosen Enterprise app registration.

![secret-create](media/secret.png ':size=75%')


## Token Generation

Azure access tokens can be generated in a number of ways.

1. Using a oauth2 helper like [oauth2c](https://github.com/cloudentity/oauth2c).

```bash
# install the helper
go install github.com/cloudentity/oauth2c@latest

# generate a access help
oauth2c https://login.microsoftonline.com/4ae48b41-0137-4599-8661-fc641fe77bea/v2.0 \
  --client-id d8cf2551-1d16-4e9e-9ab8-a4b1d19d9459 \
  --client-secret $secret \
  --response-types code \
  --response-mode query \
  --grant-type authorization_code \
  --auth-method client_secret_post \
  --scopes offline_access,d8cf2551-1d16-4e9e-9ab8-a4b1d19d9459/.default

```

Opening the generated url in a Arup authenticated browser will generate a access token.

![oauth2c-flow](media/code-flow-oauth2c.png ':size=75%')

2. Using Curl

Opening the follow link in a Arup authenticated browser will generate a authorisation code, but will timeout when it redirects to localhost.

https://login.microsoftonline.com/4ae48b41-0137-4599-8661-fc641fe77bea/oauth2/authorize?client_id=d8cf2551-1d16-4e9e-9ab8-a4b1d19d9459&response_type=code&scope='offline_access d8cf2551-1d16-4e9e-9ab8-a4b1d19d9459/.default'&response_mode=query&redirect_uri=http://localhost:9876/callback

The authorisation code can then be copied into the following curl command to generate a JWT access token.

```
$curl "https://login.microsoftonline.com/4ae48b41-0137-4599-8661-fc641fe77bea/oauth2/token" \
	-F "redirect_uri=http://localhost:9876/callback" \
	-F "grant_type=authorization_code" \
	-F "resource=d8cf2551-1d16-4e9e-9ab8-a4b1d19d9459" \
	-F "client_id=d8cf2551-1d16-4e9e-9ab8-a4b1d19d9459" \
	-F "client_secret=$secret" \
	-F "scope=offline_access d8cf2551-1d16-4e9e-9ab8-a4b1d19d9459/.default" \
	-F "code=$code"
```
## IAM Store Admin

A helper script is located under `./scripts/authcli.py` to allow generation of data in the IAM store.

The helper script uses the [fire cli framework](https://google.github.io/python-fire/using-cli/). So will require the fire python dependency installed prior to use.

```
pip3 install fire
```

A general help page is available for 

```

$./scripts/authcli.py 

NAME
    authcli.py

SYNOPSIS
    authcli.py - COMMAND

COMMANDS
    COMMAND is one of the following:

     azure
       Adds a azure principle to role mapping

     tenant
       Adds a new tenant to the database

     token
       Adds a token to role mapping
```

### Adding a new tenant

```
# add a "demo" tenant to our QA environment (required valid AWS creds)
$./authcli.py tenant --name=demo --environment=qa
created tenant id: 24982f51-c972-48be-9e88-af0ee284fe5d

```

### Adding a new API Token

```
# add a API token mapping to the "admin" role in the "demo" tenant to our QA environment (required valid AWS creds)
$./authcli.py token --tenant=24982f51-c972-48be-9e88-af0ee284fe5d --principle=nick@arup.com --role=admin --environment=qa
```

### Adding a new tenant

```
# add a azure user mapping to the "admin" role in the "demo" tenant to our QA environment (required valid AWS creds)
$./authcli.py azure --tenant=bf12581f-2263-450d-8668-1c7f7f54e348 --azureuid=98ab8575-0527-4f71-b9f1-b73b52fa58bb --principle=nick@arup.com --role=admin --environment=qa
```



