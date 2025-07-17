import boto3
import mimetypes
from typing import List, Dict, Optional


s3_client = boto3.client("s3")
paginator = s3_client.get_paginator("list_objects_v2")


def list_s3_bucket_items(
    bucket_name: str,
    prefix: str = "",
    max_keys: Optional[int] = None
) -> List[Dict[str, str]]:
    """
    List items in an S3 bucket using the boto3 client.

    Args:
        bucket_name (str): Name of the S3 bucket.
        prefix (str): Optional key prefix to filter objects.
        max_keys (Optional[int]): Optional limit for number of keys returned.

    Returns:
        List[Dict[str, str]]: List of S3 object metadata dictionaries.
    """

    pagination_config = {}
    if max_keys:
        pagination_config["MaxItems"] = max_keys

    file_items: List[Dict[str, str]] = []

    page_iterator = paginator.paginate(
        Bucket=bucket_name,
        Prefix=prefix,
        PaginationConfig=pagination_config,
        Delimiter="/"
    )

    for page in page_iterator:
        # files = [obj["Key"] for obj in page.get("Contents", [])]
        folders = [obj["Prefix"] for obj in page.get("CommonPrefixes", [])]
        for obj in page.get("Contents", []):
            key = obj["Key"]

            # Skip if the key is the same as the prefix (root directory)
            if key == prefix or key.endswith('/'):
                continue

            size = obj["Size"]
            last_modified = obj["LastModified"]
            storage_class = obj.get("StorageClass", "STANDARD")

            # Guess MIME type based on file extension
            content_type, _ = mimetypes.guess_type(key)
            content_type = content_type or "application/octet-stream"

            file_items.append({
                "key": key,
                "name": key.split("/")[-1],
                "size": str(size),
                "last_modified": last_modified.isoformat(),
                "storage_class": storage_class,
                "type": content_type,
            })

    return {"files": file_items, "folders": folders}
