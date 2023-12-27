# Local development overrides
ifdef OS
    export USER_ID=0
    export GROUP_ID=0
else
    export USER_ID=$(shell id -u)
    export GROUP_ID=$(shell id -g)
endif

# Load env for local use if it exists
ifneq ("$(wildcard make-private.mk)","")
 	$(info Including make-private.mk file)
	include make-private.mk
endif

# Useful variables
export TOOLS_ACCOUNT        ?= 372865390843
export TOOLS_ACCOUNT_REGION ?= eu-west-1
export AWS_DEFAULT_REGION   ?= eu-west-1
BUILD_SOURCEVERSION         ?= abcd

USE_COMPOSE_FILE ?= false

# Commands
# --------------
RUN_TF_BASH		?= docker-compose run --rm --entrypoint bash terraform

TF_ARTIFACT_JSON = $(TF_ARTIFACT).json

.PHONY: tf_shell
tf_shell:
	echo -e --- $(CYAN)Running TF Shell ...$(NC)
	${RUN_TF_BASH}

.PHONY: plan_apply
plan_apply: plan apply
	$(TASK_DONE)

.PHONY: plan_deployrole
plan_deployrole: init
	echo -e --- $(CYAN)Running plan ...$(NC)
	${RUN_TF} plan \
		${TF_VARS} \
		-target="aws_iam_role_policy.deploy_policy" \
		-target="aws_iam_role.deploy_role" \
		-target="aws_iam_role_policy_attachment.managed_roles" \
		-out=${TF_ARTIFACT} 
	$(TASK_DONE)

.PHONY: apply_deployrole
apply_deployrole: init
	echo -e --- $(CYAN)Appying deploy role resources...$(NC)
	${RUN_TF} apply \
		${TF_VARS} \
		-var "release_hash=$(BUILD_SOURCEVERSION)" \
		-auto-approve \
		-target aws_iam_role.deploy_role \
		-target aws_iam_role_policy.deploy_policy \
		-target aws_iam_role_policy_attachment.managed_roles
	@$(TASK_DONE)

.PHONY: docker_pull
docker_pull:
	aws ecr get-login-password --region $(TOOLS_ACCOUNT_REGION) | docker login --username AWS --password-stdin $(TOOLS_ACCOUNT).dkr.ecr.$(TOOLS_ACCOUNT_REGION).amazonaws.com
	docker-compose pull

.PHONY: show_plan
show_plan:
	echo -e --- $(CYAN)Generating JSON Terraform deployment plan ...$(NC)
	$(RUN_TF_BASH) -c "terraform show -json $(TF_ARTIFACT) | jq '.' > $(TF_ARTIFACT_JSON)"

.PHONY: state_unlock
state_unlock:
	echo -e --- $(CYAN)Unlocking Terraform state ...$(NC)
	${RUN_TF} force-unlock -force $(shell read -p "Enter Lock ID : " lock && echo $$lock)

.PHONY: fix_multiarch
fix_multiarch:
	echo -e $(CYAN)Enable Multi-arch containers ...$(NC)
	docker run --rm --privileged multiarch/qemu-user-static --reset -p yes
