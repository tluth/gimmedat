# Meta tasks
# ----------

# Useful variables
export SAM_CLI_TELEMETRY=0

# region
export AWS_REGION ?= eu-west-1

export AWS_TOOLS_ACCOUNT ?= 372865390843

export CODE_DOMAIN ?= adp-codeartifact
export CODE_REPO ?= gdam

# Output helpers
# --------------

TASK_DONE = echo "✓  $@ done"
TASK_BUILD = echo "🛠️  $@ done"

# ----------------
.DEFAULT_GOAL := help

lambda/test/auth: ## Test a local invoke of the lambda.
	@sam local invoke Lambda --event test/auth-event.json --template test/template.yaml --env-vars test/environment.json  --region $(AWS_REGION)
	@$(TASK_BUILD)

lambda/installdeps: ## install the deps
    # use sam to build our deps (remove the cache though - it causes annoying dep issues)
	@export AWS_ACCESS_KEY_ID=$(shell aws configure get aws_access_key_id) && \
    export AWS_SECRET_ACCESS_KEY=$(shell aws configure get aws_secret_access_key) && \
    export AWS_SESSION_TOKEN=$(shell aws configure get aws_session_token) && \
	sam build --use-container --template-file ./test/template.yaml \
		--container-env-var SAM_CLI_TELEMETRY=$$SAM_CLI_TELEMETRY \
		--container-env-var AWS_ACCESS_KEY_ID=$$AWS_ACCESS_KEY_ID \
		--container-env-var AWS_SECRET_ACCESS_KEY=$$AWS_SECRET_ACCESS_KEY \
		--container-env-var AWS_SESSION_TOKEN=$$AWS_SESSION_TOKEN
	@cp -Rp .aws-sam/build/Lambda/lib ./lib
	@rm -rf ./.aws-sam
	@$(TASK_BUILD)

build-Lambda:
	@cp *.py $(ARTIFACTS_DIR)
	@cp requirements.txt $(ARTIFACTS_DIR)
	@pip3 install -r requirements.txt --upgrade -t $(ARTIFACTS_DIR)/lib
	@$(TASK_BUILD)

clean: ## clean any generated files
	@rm -rf ./lib ./.aws-sam
	@$(TASK_BUILD)

help: ## Show this help message.
	@echo 'usage: make [target] ...'
	@echo
	@echo 'targets:'
	@egrep '^(.+)\:\ ##\ (.+)' ${MAKEFILE_LIST} | column -t -c 2 -s ':#'
