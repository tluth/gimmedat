from typing import Any
import logging

import boto3 

from config import appconfig

logger = logging.getLogger(__name__)
s3_client = boto3.client('s3')


def remove_expired_item_s3(record: dict) -> str | None:
    if record.get("eventName") != "REMOVE":
        return
    try:
        s3_key = record["dynamodb"]["Keys"]["s3_path"]["S"]
        s3_client.delete_object(
            Bucket=appconfig.storage_bucket,
            Key=s3_key
            )
        return s3_key
    except KeyError:
        logger.error("Record doesn't match expected pattern."
                     f"Skipping eventID: {record.get('eventID')}")
        return
    except Exception as e:
        logger.error("Failed to delete item due to the following exception:")
        logger.error(repr(e))
        return


def handler(event: Any, context: Any) -> None:
    logger.info("processing event")
    logger.info(event)
    removed_files = []
    for record in event["Records"]:
        s3_item = remove_expired_item_s3(record)
        removed_files.append(s3_item)
    logger.info("The following items were deleted from s3:")
    logger.info(removed_files)


