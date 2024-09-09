import os
import logging
import urllib
from pathlib import Path

from .utils import (
    serialize_event_data,
    add_to_blacklist,
    get_file_record,
    send_email
)

logger = logging.getLogger(__name__)

NEW_OBJECT_CACHE: dict[str, list] = {}


def check_cache_for_duplicate_files(s3_key: str, ip_address: str, filesize: int) -> dict:
    """
        Cache the uploaded file info and add user IP address to
        blacklist table if we receive a file with same name and
        size > 10 times or if we just get >1000 requests from the same user
        (Lambda should stay warm and retain cache for approx 15 mins so this is
        a limit of around 1 request every second for 15 mins straight)
    """
    global NEW_OBJECT_CACHE

    new_item = {
        "filename": os.path.basename(s3_key),
        "filesize": filesize
    }

    if ip_address not in NEW_OBJECT_CACHE:
        NEW_OBJECT_CACHE[ip_address] = [new_item]
    else:
        NEW_OBJECT_CACHE[ip_address].append(new_item)

    # check for too much of a good thing
    if NEW_OBJECT_CACHE[ip_address].count(new_item) > 10:
        add_to_blacklist(ip_address, s3_key)
        logger.info(
            f"IP: {ip_address} blacklisted for repeatedly uploading the same file"
        )
    # check for too much of the same dickhead
    if len(NEW_OBJECT_CACHE[ip_address]) > 1000:
        logger.info(
            f"IP: {ip_address} blacklisted for unreasonable number of uploads"
        )

    return NEW_OBJECT_CACHE


def lambda_handler(event, context):
    """
    Lambda Function for Sending Data event
    Args:
        event ([type]): Json event
        context ([type]): [description]
    """
    # Check cache for duplicate uploads
    data_response = serialize_event_data(event)
    global NEW_OBJECT_CACHE
    NEW_OBJECT_CACHE = check_cache_for_duplicate_files(
        data_response["object_key"],
        data_response["source_ip"],
        data_response["object_size"]
    )
    # Check if email needs to be sent
    print("=====")
    s3_key = urllib.parse.unquote(data_response["object_key"])
    file_id = Path(s3_key).parts[0]
    file_record = get_file_record(file_id, s3_key)
    print(file_record)
    if "recipient_email" in file_record and "sender" in file_record:
        send_email(file_record)
