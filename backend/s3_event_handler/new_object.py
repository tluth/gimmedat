import os

from .utils import serialize_event_data, add_to_blacklist


NEW_OBJECT_CACHE: dict[str, list] = {}


def check_cache(s3_key: str, ip_address: str, filesize: int) -> dict:
    """
        Cache the uploaded file info and add user IP address to
        blacklist table if we receive a file with same name and 
        size > 10 times
    """
    global NEW_OBJECT_CACHE

    new_item = {
        "filename": os.path.basename(s3_key),
        "filesize": filesize
    }

    if ip_address not in NEW_OBJECT_CACHE:
        NEW_OBJECT_CACHE[ip_address] = [new_item]

    elif new_item not in NEW_OBJECT_CACHE[ip_address]:
        NEW_OBJECT_CACHE[ip_address].append(new_item)

    elif NEW_OBJECT_CACHE[ip_address].count(new_item) > 10:
        add_to_blacklist(ip_address, s3_key)

    return NEW_OBJECT_CACHE


def lambda_handler(event, context):
    """
    Lambda Function for Sending Data event
    Args:
        event ([type]): Json event
        context ([type]): [description]
    """
    data_response = serialize_event_data(event)
    global NEW_OBJECT_CACHE
    NEW_OBJECT_CACHE = check_cache(
        data_response["object_key"],
        data_response["source_ip"],
        data_response["object_size"]
    )
