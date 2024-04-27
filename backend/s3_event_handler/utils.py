import pendulum
import boto3
from .config import appconfig


def get_file(s3_key):
    pass


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


def get_expiry_date() -> int:
    now = pendulum.now()
    expiry = now + pendulum.duration(hours=2)
    return expiry.int_timestamp


def add_to_blacklist(ip_address: str, s3_key: str):
    db_client = boto3.resource('dynamodb')
    table = db_client.Table(appconfig.blaclist_table_name)
    table.put_item(Item={
        'ip_address': ip_address,
        'created_at':  pendulum.now().int_timestamp,
        "expire_at": get_expiry_date(),
        "s3_key": s3_key
    })
