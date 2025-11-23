
# deployment environment
export ENVIRONMENT ?= dev

# region
export AWS_REGION ?= eu-central-1

# account
export AWS_ACCOUNT ?= 577284652785

# if we store our artifact
export TF_ARTIFACT ?= ".terraform/$(ENVIRONMENT).plan"

# Terraform variables
# --------------
BACKEND_BUCKET	:= "gimmedat-terraform"
BACKEND_KEY 	:= "gimmedat-${ENVIRONMENT}.tfstate"


# Output helpers
# --------------
TASK_DONE = echo "✓  $@ done"
TASK_BUILD = echo "🛠️  $@ done"

# ----------------
.DEFAULT_GOAL := terraform/plan

clean:
	@rm -rf $(CURDIR)/.terraform vendor
	@$(TASK_DONE)

init: terraform/init
	@$(TASK_DONE)

plan: terraform/plan
	@$(TASK_DONE)

apply: terraform/apply
	@$(TASK_DONE)

destroy: terraform/destroy
	@$(TASK_DONE)

terraform/format: ## Correct formatting.
	@terraform fmt $(CURDIR)
	@$(TASK_BUILD)

terraform/format/check: ## Run a formatting check.
	@terraform fmt -check $(CURDIR)
	@$(TASK_BUILD)

terraform/plan:
	terraform plan -var-file=config/$(ENVIRONMENT).tfvars
	@$(TASK_BUILD)

terraform/plan/artifact:
	terraform plan -var-file=config/$(ENVIRONMENT).tfvars -out $(TF_ARTIFACT)
	@$(TASK_BUILD)

terraform/plan/artifact/ci:
	@terraform plan -var-file=config/$(ENVIRONMENT).tfvars -detailed-exitcode -out $(TF_ARTIFACT); \
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
	@$(TASK_BUILD)

terraform/apply:
	terraform apply -var-file=config/$(ENVIRONMENT).tfvars -auto-approve
	@$(TASK_BUILD)

terraform/apply/artifact:
	terraform apply -auto-approve $(TF_ARTIFACT)
	@$(TASK_BUILD)

terraform/apply/deployrole:
	terraform apply -auto-approve -target aws_iam_role.deploy_role -target aws_iam_role_policy_attachment.admin_policy -target aws_iam_role_policy_attachment.terraform_policy -target aws_iam_role_policy.additional_iam_policy
	@$(TASK_BUILD)

terraform/destroy:
	terraform destroy
	@$(TASK_BUILD)

terraform/init: terraform/module/init
	terraform init \
		-backend-config=bucket=${BACKEND_BUCKET} \
		-backend-config=key=${BACKEND_KEY} \
		-backend-config=region=${AWS_REGION} \
		-reconfigure
	@if [ `terraform workspace list | grep -c $(ENVIRONMENT)` -eq 0 ] ; then \
		terraform workspace new $(ENVIRONMENT); \
	else \
		terraform workspace select $(ENVIRONMENT); \
	fi
	@$(TASK_BUILD)

terraform/lint: ## Run a lint across the module.
	docker run --rm -v $(CURDIR):/data -v $(CURDIR)/.tflint.hcl:/data/.tflint.hcl -t ghcr.io/terraform-linters/tflint-bundle:latest
	@$(TASK_BUILD)

terraform/security: ## Run a security scan.
	docker run --rm -it -v "$(CURDIR):/src" -v "$(CURDIR)/.tfsec:/src/.tfsec" aquasec/tfsec /src --exclude-downloaded-modules --exclude-path /src/vendor
	@$(TASK_BUILD)

terraform/module/init:
	terrafile
	@$(TASK_BUILD)

help: ## Show this help message.
	@echo 'usage: make [target] ...'
	@echo
	@echo 'targets:'
	@egrep '^(.+)\:\ ##\ (.+)' ${MAKEFILE_LIST} | column -t -c 2 -s ':#'
