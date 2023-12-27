SHELL := /bin/bash
.SILENT:

RED = '\033[1;31m'
CYAN = '\033[0;36m'
NC = '\033[0m'

ifdef BUILD_SOURCESDIRECTORY
 	$(info Running in Azure DevOps)
	GROUP_START = echo -e '\#\#[group]'
	GROUP_END   = echo '\#\#[endgroup]'
else
 	$(info Including make-local.mk file)
	include make-local.mk
	GROUP_START = echo -e --- 
endif


# Meta tasks
# ----------

# Useful variables
export AWS_REGION  ?= eu-west-1
export ENVIRONMENT ?= dev
CONFIG             ?= "${ENVIRONMENT}"

# if we store our artifact
export TF_ARTIFACT ?= ".terraform/$(CONFIG).plan"

#
export BUILD_SOURCEVERSION ?=$(shell git rev-list -1 HEAD)

# Terraform variables
# --------------
BACKEND_BUCKET	:=$(shell aws ssm get-parameter --name "/adp/baseline/tfstate/s3-bucket-name" --query Parameter.Value --region ${AWS_REGION} --output text 2>/dev/null)
BACKEND_DB	    :=$(shell aws ssm get-parameter --name "/adp/baseline/tfstate/dynamodb-table-name" --query Parameter.Value --region ${AWS_REGION} --output text 2>/dev/null)
BACKEND_KEY 	:= "adp-geotransform-infra/${CONFIG}.tfstate"

export CURDIR
export TF_VAR_lambda_builder_folder_path ?= ${CURDIR}/lambda-builder

# terraform configuration
TF_VARS := 	-var default_region=${AWS_DEFAULT_REGION} \
			-var-file=config/${CONFIG}.tfvars \
			-var "release_hash=$(BUILD_SOURCEVERSION)"

# Output helpers
# --------------

TASK_DONE = echo "✓  $@ done"
TASK_BUILD = echo "🛠️  $@ done"

ifeq ($(USE_COMPOSE_FILE), true)
 	$(info Using docker compose)	
	export TERRAFORM_VERSION :=$(shell awk '/terraform/ {print $$2}' ../.tool-versions)

	RUN_TF          ?= docker-compose run --rm terraform
	RUN_TERRAFILE   ?= docker-compose run --rm adp-buildagent-image terrafile
	RUN_TFLINT      ?= docker-compose run --rm adp-buildagent-image tflint
	RUN_TFSEC       ?= docker-compose run --rm adp-buildagent-image tfsec
else
	RUN_TF          ?= terraform
	RUN_TERRAFILE   ?= terrafile
	RUN_TFLINT      ?= tflint
	RUN_TFSEC       ?= tfsec
endif


# ----------------
.DEFAULT_GOAL := terraform/plan

.PHONY: clean
clean:
	rm -rf "$(CURDIR)/.terraform"
	rm -rf "$(CURDIR)/.terraform.d"
	rm -rf "${TF_ARTIFACT}"
	rm -rf vendor
	rm -rf $(CURDIR)/.tflint.d
	$(TASK_DONE)

.PHONY: init
init: terraform/init
	$(TASK_DONE)

.PHONY: plan
plan: terraform/plan/artifact terraform/show/summary
	$(TASK_DONE)

.PHONY: apply
apply: terraform/apply
	$(TASK_DONE)

.PHONY: destroy
destroy: terraform/destroy
	$(TASK_DONE)

.PHONY: terraform/format
terraform/format: ## Correct formatting.
	$(RUN_TF) fmt -recursive
	$(TASK_BUILD)

.PHONY: terraform/format/check
terraform/format/check: ## Run a formatting check.
	$(RUN_TF) fmt -check -recursive
	$(TASK_BUILD)

.PHONY: terraform/plan
terraform/plan:
	$(RUN_TF) plan ${TF_VARS}
	$(TASK_BUILD)

.PHONY: terraform/plan/artifact
terraform/plan/artifact:
	$(RUN_TF) plan ${TF_VARS} -out=${TF_ARTIFACT}
	$(TASK_BUILD)

.PHONY: terraform/plan/artifact/ci
terraform/plan/artifact/ci:
	$(GROUP_START)$(CYAN)Running plan ...$(NC)
	$(RUN_TF) plan ${TF_VARS} -out $(TF_ARTIFACT) -detailed-exitcode; \
	TF_RETURN=$$? ; \
	if [ $${TF_RETURN} -eq 2 ] ; then \
		echo "terraform changes detected"; \
		echo "##vso[task.setvariable variable=TERRAFORM_CHANGE;issecret=false;isoutput=true]true"; \
    elif [ $${TF_RETURN} -eq 1 ]; then \
	    echo "terraform error detected"; \
        exit 1; \
	else \
		echo "no terraform changes detected"; \
		echo "##vso[task.setvariable variable=TERRAFORM_CHANGE;issecret=false;isoutput=true]false"; \
	fi
	$(TASK_BUILD)
	$(GROUP_END)

.PHONY: terraform/show/summary
terraform/show/summary:
	echo -e --- $(CYAN)Plan Summary:$(NC)
	$(RUN_TF) show -no-color -json ${TF_ARTIFACT} \
		| jq -r '[.resource_changes[] | select (.change.actions != ["no-op"])] as $$changes | if ($$changes | length) == 0 then "No changes" else (map($$changes[] | {action: .change.actions| join(",") | ascii_upcase, addr: .address}) | unique_by(.addr) | group_by(.action) | map(.[0].action as $$action | del (.[].action) | map(.addr) | "\($$action) (\(. | length)):\n    \(map(.) | join("\n    "))\n") | .[] ) end' \
		| sed 's/DELETE,CREATE/REPLACE/' \
		| sed 's/CREATE,DELETE/REPLACE/'
	echo Geo transform API Override: ${TF_VAR_geo_transform_api_version_override}

.PHONY: terraform/apply
terraform/apply:
	$(RUN_TF) apply ${TF_VARS} -auto-approve
	$(TASK_BUILD)

.PHONY: terraform/apply/artifact
terraform/apply/artifact:
	$(RUN_TF) apply -auto-approve $(TF_ARTIFACT) 
	$(TASK_BUILD)

.PHONY: terraform/destroy
terraform/destroy:
	$(RUN_TF) destroy ${TF_VARS} -auto-approve -input=false
	$(TASK_BUILD)

.PHONY: terraform/plan/destroy
terraform/plan/destroy:
	$(RUN_TF) plan -destroy -input=false ${TF_VARS}
	$(TASK_BUILD)

.PHONY: terraform/init
terraform/init: terraform/module/init
	$(RUN_TF) init \
		-backend-config=bucket=${BACKEND_BUCKET} \
		-backend-config=key=${BACKEND_KEY} \
		-backend-config=dynamodb_table=${BACKEND_DB} \
		-backend-config=region=${AWS_REGION} \
		-reconfigure
	if [ `$(RUN_TF) workspace list | grep -c $(ENVIRONMENT)` -eq 0 ] ; then \
		$(RUN_TF) workspace new $(ENVIRONMENT); \
	else \
		$(RUN_TF) workspace select $(ENVIRONMENT); \
	fi
	$(TASK_BUILD)

.PHONY: terraform/validate
terraform/validate:
	$(RUN_TF) validate
	$(TASK_BUILD)
	
.PHONY: terraform/lint
terraform/lint: ## Run a lint across the module.
	$(RUN_TFLINT) --init --config=.tflint.hcl
	$(RUN_TFLINT) --format compact --config=.tflint.hcl
	$(TASK_BUILD)

.PHONY: terraform/security
terraform/security: ## Run a security scan.
	$(RUN_TFSEC) --config-file=.tfsec/config.yaml --exclude-downloaded-modules --exclude-path vendor
	$(TASK_BUILD)

.PHONY: terraform/module/init
terraform/module/init:
	$(RUN_TERRAFILE)
	$(TASK_BUILD)

.PHONY: help
help: ## Show this help message.
	echo 'usage: make [target] ...'
	echo
	echo 'targets:'
	egrep '^(.+)\:\ ##\ (.+)' ${MAKEFILE_LIST} | column -t -c 2 -s ':#'
