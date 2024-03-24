#!/bin/bash
set -euo pipefail

ACCOUNT=${1:-dev}

ACCOUNT_ID=$(cat $(dirname ${0})/accounts.json |jq --arg a "${ACCOUNT}" -r '.[$a]')

echo "${ACCOUNT} -> ${ACCOUNT_ID}"

# default to azure if actions env not present
if [[ -z "${GITHUB_ACTIONS}" ]]; then
    echo "##vso[task.setvariable variable=ACCOUNT_ID;issecret=true;isoutput=true]${ACCOUNT_ID}"
else
    echo "::set-output name=ACCOUNT_ID::${ACCOUNT_ID}"
fi
