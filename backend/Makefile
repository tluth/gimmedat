.EXPORT_ALL_VARIABLES:

API_LAMBDA_NAME = "${PRODUCT}-${ENVIRONMENT}"
API_BUILD_DIR = api_build

DB_STREAM_LAMBDA_NAME="${PRODUCT}-${ENVIRONMENT}-trash-collection"
DB_STREAM_BUILD_DIR=db_stream_handler_build

S3_HANDLER_LAMBDA_NAME="${PRODUCT}-${ENVIRONMENT}-s3-event-handler"
S3_HANDLER_BUILD_DIR=s3_event_handler_build

EMAILER_LAMBDA_NAME="${PRODUCT}-${ENVIRONMENT}-email-sender"
EMAILER_BUILD_DIR=email_sender_build


run_api:
	uvicorn api.run_api:app --port 5000 --reload

clean:
	@if [ -d ${API_BUILD_DIR} ]; then \
		rm -r ${API_BUILD_DIR}; \
	fi
	@if [ -d ${DB_STREAM_BUILD_DIR} ]; then \
		rm -r ${DB_STREAM_BUILD_DIR}; \
	fi
	@if [ -d ${S3_HANDLER_BUILD_DIR} ]; then \
		rm -r ${S3_HANDLER_BUILD_DIR}; \
	fi
	@if [ -d ${EMAILER_BUILD_DIR} ]; then \
		rm -r ${EMAILER_BUILD_DIR}; \
	fi

format:
	autopep8 --in-place --aggressive --aggressive -r .

# API
build_local: clean
	mkdir ${API_BUILD_DIR} && pip3 install -r requirements.txt --platform manylinux2014_x86_64 --target=${API_BUILD_DIR} --only-binary=:all:
	cp -r api ./${API_BUILD_DIR}/api/ && cd ${API_BUILD_DIR} && zip -r ../${API_BUILD_DIR}.zip .

deploy_api: build_local
	aws lambda update-function-code --function-name ${API_LAMBDA_NAME} \
	--zip-file fileb://${API_BUILD_DIR}.zip
	rm -r ./${API_BUILD_DIR} && rm ${API_BUILD_DIR}.zip

# DynamoDB TTL Event Handler
build_trash_collector: clean
	mkdir ${DB_STREAM_BUILD_DIR} && pip3 install -r requirements.txt --target=${DB_STREAM_BUILD_DIR}
	cp -r db_stream_handler ./${DB_STREAM_BUILD_DIR}/ && cd ${DB_STREAM_BUILD_DIR} && zip -r ../${DB_STREAM_BUILD_DIR}.zip .

deploy_trash_collector: build_trash_collector
	aws lambda update-function-code --function-name ${DB_STREAM_LAMBDA_NAME} \
	--zip-file fileb://${DB_STREAM_BUILD_DIR}.zip
	rm -r ./${DB_STREAM_BUILD_DIR} && rm ${DB_STREAM_BUILD_DIR}.zip

# S3 Upload Event Handler
build_s3_handler: clean
	mkdir ${S3_HANDLER_BUILD_DIR} && pip3 install -r s3_event_handler/requirements.txt --target=${S3_HANDLER_BUILD_DIR}
	cp -r s3_event_handler ./${S3_HANDLER_BUILD_DIR}/ && cd ${S3_HANDLER_BUILD_DIR} && zip -r ../${S3_HANDLER_BUILD_DIR}.zip .

deploy_s3_handler: build_s3_handler
	aws lambda update-function-code --function-name ${S3_HANDLER_LAMBDA_NAME} \
	--zip-file fileb://${S3_HANDLER_BUILD_DIR}.zip
	rm -r ./${S3_HANDLER_BUILD_DIR} && rm ${S3_HANDLER_BUILD_DIR}.zip

# Email Lambda
build_email_lambda: clean
	mkdir ${EMAILER_BUILD_DIR} && pip3 install -r email_sender/requirements.txt --target=${EMAILER_BUILD_DIR}
	cp -r email_sender ./${EMAILER_BUILD_DIR}/ && cd ${EMAILER_BUILD_DIR} && zip -r ../${EMAILER_BUILD_DIR}.zip .

deploy_email_lambda: build_email_lambda
	aws lambda update-function-code --function-name ${EMAILER_LAMBDA_NAME} \
	--zip-file fileb://${EMAILER_BUILD_DIR}.zip
	rm -r ./${EMAILER_BUILD_DIR} && rm ${EMAILER_BUILD_DIR}.zip

deploy: deploy_api deploy_trash_collector deploy_s3_handler deploy_email_lambda
