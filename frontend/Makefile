.SILENT:
.EXPORT_ALL_VARIABLES:

# deployment environment
CONTENTBUCKET ?= ${PRODUCT}-${ENVIRONMENT}-origin

all: help

clean: ## cleanup the node install.
	rm -rf node_modules build

deps: clean
	@echo "installing deps"
	npm install

build: deps
	@echo "building site"
	export NODE_OPTIONS="--max_old_space_size=7168" && npm run build

deploy: ## deploy our ui.
	@echo "deploying site"
	aws s3 sync --delete ./build/ s3://${CONTENTBUCKET}

lint: ## run our lint
	npm run lint