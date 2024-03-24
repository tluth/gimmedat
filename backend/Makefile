.EXPORT_ALL_VARIABLES:

# deployment environment
ENVIRONMENT ?= dev

COMMIT=$(shell git rev-list -1 HEAD --abbrev-commit)
BRANCH=$(shell git rev-parse --abbrev-ref HEAD)
DATE=$(shell date -u '+%Y%m%d')

build:
	mkdir build && pip3 install -r requirements.txt --target="build/"
	cp -r api ./build/api/
	cd build && zip -r ../build.zip .
	aws lambda update-function-code --function-name gimmedat-dev \
	--zip-file fileb://build.zip
	rm -r ./build