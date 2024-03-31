import boto3 
from pydantic import AnyUrl
from botocore.client import Config

from .config import appconfig


s3_con = boto3.client(
    "s3",
    config=Config(signature_version="s3v4")
)


def get_put_presigned_url(path: str, file_type: str) -> AnyUrl:
    return s3_con.generate_presigned_url(
        "put_object",
        Params={
            "Bucket": appconfig.storage_bucket,
            "Key": path,
            "ContentType": file_type,
            "ACL": "private"
        },
        ExpiresIn="20",
        HttpMethod="PUT",
    )


def get_get_presigned_url(key):
    return s3_con.generate_presigned_url(
        "get_object",
        Params={
            "Bucket": appconfig.storage_bucket, 
            "Key": key,
            'ResponseContentDisposition': 'attachment',
            },
        ExpiresIn="360",
    )
