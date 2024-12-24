SHELL := /bin/bash
.SILENT:
.EXPORT_ALL_VARIABLES:

ENVIRONMENT ?= dev
PRODUCT = gimmedat

all: help 

setup_local_env:
	. .env

infra__%:
	"${MAKE}" --directory infra $*

backend__%:
	"${MAKE}" --directory backend $*

frontend__%:
	"${MAKE}" --directory frontend $*


