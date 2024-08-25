# Backend Stuff

This directory contains the Rest API as well as other backend components for Gimmedat. While the `requirements.txt` file in the root of this directory contains the dependencies for the API specifically, the other components do not have any additional unique dependencies. Therefore, for local dev purposes, it's fine to create one common virtual environment only using the dependencies listed in this file. 


## Pre-reqs

To run and deploy this locally, you will need:

- Python >3.10
- GNU Make

## REST API 
The code for the API is located in `api/`, and is built using the FastAPI framework, along with Mangun and Uvicorn for the sake of running it on serverless architecture. There is a `run_api` script in the local makefile which can be used to run the api locally. 


### Structure 

* `config/__init__.py` is used for injecting environment variables and providing default values for environment variables. 
* `db/` contains pynamodb classes which are used to handle DynamoDB stuff for the main file storage database table.  
* `app.py` provides the core FastAPI application setup
* `models.py` contains pydantic models for stuff like API request and response bodies.
* `router.py` is where we define all the endpoints (this is in a single file for now, given how few endpoints we have but may be split into a directory of multiple files later if necessary).
* `run_api.py` is the entry point script for running the API. 
* The rest should be fairly self explanatory. 


### Running locally

1. Set up a local virtual environment and pip install requirements.txt
2. Either run ```make backend__run_api``` from the repo's root directory or run ```uvicorn api.run_api:app --port 5000 --reload``` from the `backend/` directory.

## DynamoDB Event Handler 
Under `db_stream_handler/` is code that runs on a lambda, triggered by dynamoDB stream TTL events. This is just for removing S3 objects after the TTL is reached. Fairly straight forward. 

## S3 Event Handler 
Under `s3_event_handler/` is code that runs on a lambda, triggered by S3 upload events. Currently this is used to check if someone is uploading the same file multiple times within a short period of time, but the long term goal is to use this for other security and monitoring purposes. 