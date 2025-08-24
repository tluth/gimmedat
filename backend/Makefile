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

deploy_api:
	docker build ../build/scripts -t lambda-builder:3.12
	../build/scripts/lambda-builder.sh ${API_BUILD_DIR} api ./backend/requirements.txt
	aws lambda update-function-code --function-name ${API_LAMBDA_NAME} \
	    --zip-file fileb://../build/${API_BUILD_DIR}.zip
	rm -rf ../build/${API_BUILD_DIR} ../build/${API_BUILD_DIR}.zip

# DynamoDB TTL Event Handler
deploy_trash_collector: clean
	docker build ../build/scripts -t lambda-builder:3.12
	../build/scripts/lambda-builder.sh ${DB_STREAM_BUILD_DIR} db_stream_handler ./backend/requirements.txt
	aws lambda update-function-code --function-name ${DB_STREAM_LAMBDA_NAME} \
	    --zip-file fileb://../build/${DB_STREAM_BUILD_DIR}.zip
	rm -rf ../build/${DB_STREAM_BUILD_DIR} ../build/${DB_STREAM_BUILD_DIR}.zip

# S3 Upload Event Handler
deploy_s3_handler:
	docker build ../build/scripts -t lambda-builder:3.12
	../build/scripts/lambda-builder.sh ${S3_HANDLER_BUILD_DIR} s3_event_handler ./backend/s3_event_handler/requirements.txt
	aws lambda update-function-code --function-name ${S3_HANDLER_LAMBDA_NAME} \
	    --zip-file fileb://../build/${S3_HANDLER_BUILD_DIR}.zip
	rm -rf ../build/${S3_HANDLER_BUILD_DIR} ../build/${S3_HANDLER_BUILD_DIR}.zip

# Email service
deploy_email_lambda:
	docker build ../build/scripts -t lambda-builder:3.12
	../build/scripts/lambda-builder.sh ${EMAILER_BUILD_DIR} email_sender ./backend/email_sender/requirements.txt
	aws lambda update-function-code --function-name ${EMAILER_LAMBDA_NAME} \
	    --zip-file fileb://../build/${EMAILER_BUILD_DIR}.zip
	rm -rf ../build/${EMAILER_BUILD_DIR} ../build/${EMAILER_BUILD_DIR}.zip

deploy: deploy_api deploy_trash_collector deploy_s3_handler deploy_email_lambda
