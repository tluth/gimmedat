.EXPORT_ALL_VARIABLES:

LAMBDA_NAME = "${PRODUCT}-${ENVIRONMENT}"
BUILD_DIR = build

clean:
	@if [ -d ${BUILD_DIR} ]; then \
		@rm -r ${BUILD_DIR}; \
	fi

build_local: clean
	mkdir ${BUILD_DIR} && pip3 install -r requirements.txt --target=${BUILD_DIR}
	cp -r api ./${BUILD_DIR}/api/ && cd build && zip -r ../${BUILD_DIR}.zip .

deploy_api: build_local
	aws lambda update-function-code --function-name ${LAMBDA_NAME} \
	--zip-file fileb://${BUILD_DIR}.zip
	rm -r ./${BUILD_DIR} && rm ${BUILD_DIR}.zip