.EXPORT_ALL_VARIABLES:

API_LAMBDA_NAME = "${PRODUCT}-${ENVIRONMENT}"
API_BUILD_DIR = api_build

DB_STREAM_LAMBDA_NAME="${PRODUCT}-${ENVIRONMENT}-trash-collection"
DB_STREAM_BUILD_DIR=db_stream_handler_build

clean:
	@if [ -d ${API_BUILD_DIR} ]; then \
		rm -r ${API_BUILD_DIR}; \
	fi
	@if [ -d ${DB_STREAM_BUILD_DIR} ]; then \
		rm -r ${DB_STREAM_BUILD_DIR}; \
	fi

build_local: clean
	mkdir ${API_BUILD_DIR} && pip3 install -r requirements.txt --target=${API_BUILD_DIR}
	cp -r api ./${API_BUILD_DIR}/api/ && cd ${API_BUILD_DIR} && zip -r ../${API_BUILD_DIR}.zip .

deploy_api: build_local
	aws lambda update-function-code --function-name ${API_LAMBDA_NAME} \
	--zip-file fileb://${API_BUILD_DIR}.zip
	rm -r ./${API_BUILD_DIR} && rm ${API_BUILD_DIR}.zip


build_trash_collector: clean
	mkdir ${DB_STREAM_BUILD_DIR} && pip3 install -r db_stream_handler/requirements.txt --target=${DB_STREAM_BUILD_DIR}
	cp -r db_stream_handler ./${DB_STREAM_BUILD_DIR}/ && cd ${DB_STREAM_BUILD_DIR} && zip -r ../${DB_STREAM_BUILD_DIR}.zip .

deploy_trash_collector: build_trash_collector
	aws lambda update-function-code --function-name ${DB_STREAM_LAMBDA_NAME} \
	--zip-file fileb://${DB_STREAM_BUILD_DIR}.zip
	rm -r ./${DB_STREAM_BUILD_DIR} && rm ${DB_STREAM_BUILD_DIR}.zip