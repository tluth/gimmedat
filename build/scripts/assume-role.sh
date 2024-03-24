#!/bin/bash
set -euo pipefail

# Must set ACCOUNT_ID environment variable before running this script, e.g.
# export ACCOUNT_ID=577284652785

echo Current Identity
aws sts get-caller-identity

BUILDROLE=${BUILDROLE:-ADO-BuildAgent-Terraform}

role_arn="arn:aws:iam::$ACCOUNT_ID:role/${BUILDROLE}"
echo Assuming role $role_arn

temp_role=$(aws sts assume-role --role-arn $role_arn --role-session-name ADE-Azure-Dev-Ops)

AWS_ACCESS_KEY_ID=$(echo $temp_role | jq -r .Credentials.AccessKeyId)
AWS_SECRET_ACCESS_KEY=$(echo $temp_role | jq -r .Credentials.SecretAccessKey)
AWS_SESSION_TOKEN=$(echo $temp_role | jq -r .Credentials.SessionToken)

echo $AWS_ACCESS_KEY_ID

echo "##vso[task.setvariable variable=AWS_ACCESS_KEY_ID;issecret=true;isoutput=true]$AWS_ACCESS_KEY_ID"
echo "##vso[task.setvariable variable=AWS_SECRET_ACCESS_KEY;issecret=true;isoutput=true]$AWS_SECRET_ACCESS_KEY"
echo "##vso[task.setvariable variable=AWS_SESSION_TOKEN;issecret=true;isoutput=true]$AWS_SESSION_TOKEN"
