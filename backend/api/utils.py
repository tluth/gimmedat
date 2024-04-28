import boto3
from botocore.client import Config
import botocore
import pendulum

from .config import appconfig


s3_con = boto3.client(
    "s3",
    config=Config(signature_version="s3v4")
)


def presign_expiry_by_size(file_size: int) -> int:
    """
        Assigns a reasonable expiry time for presigned URLs
        to allow enough time for upload before expiry.
        Assumes a minimum ~512kbps upload rate
        ref: https://www.speedtest.net/global-index
    """
    # Don't bother with things <100kb
    if file_size < 102400:
        return 5

    min_bytes_per_second = 512000 / 8
    max_time_seconds = round(file_size / min_bytes_per_second)

    # Cap it at 2hrs - ya'll should get faster internet
    if max_time_seconds > 7200:
        return 7200
    # add some buffer for small file-size edge cases ~100kb
    return max_time_seconds + 2


def get_put_presigned_url(path: str, file_type: str, file_size: int) -> dict:
    return s3_con.generate_presigned_post(
        appconfig.storage_bucket,
        path,
        Fields={"content-type": file_type},
        Conditions=[
            {"content-type": file_type},
            ["content-length-range", file_size, file_size]
        ],
        ExpiresIn=presign_expiry_by_size(file_size),
    )


def get_get_presigned_url(key: str) -> dict:
    return s3_con.generate_presigned_url(
        "get_object",
        Params={
            "Bucket": appconfig.storage_bucket,
            "Key": key,
            'ResponseContentDisposition': 'attachment',
        },
        ExpiresIn="720",
    )


def calc_ttl_seconds(epoch_time: int) -> int:
    now = pendulum.now().int_timestamp
    # convert to hours
    return epoch_time - now


def blacklist_lookup(ip_address: str) -> bool:
    """
    Takes an IP address and checks whether it's in our
    table of blacklisted user IPs. Returns true if present
    """
    try:
        db_client = boto3.resource('dynamodb')
        table = db_client.Table(appconfig.blacklist_table_name)
        response = table.get_item(
            Key={
                'ip_address': ip_address
            },
            AttributesToGet=['ip_address'],
            ReturnConsumedCapacity='NONE',
        )
        return "Item" in response

    except botocore.exceptions.ClientError as e:
        print("Exception occurred:", e)
        return False
