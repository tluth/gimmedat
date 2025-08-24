.SILENT:
.EXPORT_ALL_VARIABLES:

# deployment environment
CONTENTBUCKET ?= ${PRODUCT}-${ENVIRONMENT}-origin

all: help

clean: ## cleanup the node install.
	rm -rf node_modules dist

deps: clean
	@echo "installing deps"
	pnpm install

dev:
	@echo "running dev server"
	pnpm run dev

build: deps
	@echo "building site"
	export NODE_OPTIONS="--max_old_space_size=7168" && pnpm run build

deploy: ## deploy our ui.
	@echo "deploying site"
	aws s3 sync --delete ./dist/ s3://${CONTENTBUCKET}

lint: ## run our lint
	pnpm run lint
