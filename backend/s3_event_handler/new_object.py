import os
import json
import boto3

# docs on microsoft PhotoDNA cloud service:
# https://developer.microsoftmoderator.com/docs/services/57c7426e2703740ec4c9f4c3/operations/57c7426f27037407c8cc69e6/

url = "https://api.microsoftmoderator.com/photodna/v1.0/Match?enhance=true"
headers = {
    "Ocp-Apim-Subscription-Key": "..."
}
body = {
  "DataRepresentation": "URL",
  "Value": "presigned url"
}

"""
Status 	Status codes and corresponding descriptions:

    3000: OK
    3002: Invalid or missing request parameter(s)
    3004: Unknown scenario or unhandled error occurred while processing request
    3206: The given file could not be verified as an image
    3208: Image size in pixels is not within allowed range (minimum size is 160x160 pixels; maximum size is 4MB)

"""


def serialize_event_data(json_data: dict) -> dict:
    """
    Extract data from s3 event
    Args:
        json_data ([type]): Event JSON Data
    """
    bucket = json_data["Records"][0]["s3"]["bucket"]["name"]
    timestamp = json_data["Records"][0]["eventTime"]
    s3_key = json_data["Records"][0]["s3"]["object"]["key"]
    s3_data_size = json_data["Records"][0]["s3"]["object"]["size"]
    ip_address = json_data["Records"][0]["requestParameters"][
        "sourceIPAddress"]
    event_type = json_data["Records"][0]["eventName"]
    owner_id = json_data["Records"][0]["s3"]["bucket"]["ownerIdentity"][
        "principalId"]
    
    return_json_data = {
        "event_timestamp": timestamp,
        "bucket_name": bucket,
        "object_key": s3_key,
        "object_size": s3_data_size,
        "source_ip": ip_address,
        "event_type": event_type,
        "owner_identity": owner_id
    }

    return return_json_data


def lambda_handler(event, context):
    """
    Lambda Function for Sending Data event
    Args:
        event ([type]): Json event
        context ([type]): [description]
    """
    data_response = serialize_event_data(event)
    print("=======")
    print(data_response)