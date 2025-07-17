from fastapi_cognito import CognitoToken
from fastapi import Depends, Query
from typing import List, Optional
import boto3
from botocore.exceptions import ClientError

from .trailingslash_router import APIRouter
from api.services.auth_service import cognito_default
from ..config import appconfig
from .. import utils
from ..models.file_browser import FileBrowserResponse
from ..services.s3_services import list_s3_bucket_items

authenticated_router = APIRouter()


@authenticated_router.get("/testo")
def hello_world(auth: CognitoToken = Depends(cognito_default.auth_required)):
    return {"message": "Hello world"}


@authenticated_router.get("/files/list", response_model=FileBrowserResponse)
def list_files(
    auth: CognitoToken = Depends(cognito_default.auth_required),
    prefix: Optional[str] = Query(
        None, description="The prefix to list files from. For example, 'my/folder'"),
):
    """
    Lists files in the user's directory in S3.
    The user's directory is their cognito user ID.
    An optional prefix can be provided to list files in a subdirectory.
    """
    user_id = auth.username
    full_prefix = f"{user_id}/"
    if prefix:
        full_prefix = f"{user_id}/{prefix}/"

    try:
        response = list_s3_bucket_items(
            appconfig.permanent_storage_bucket,
            full_prefix,
            max_keys=100
        )
        return response
    except ClientError as e:
        print(f"Error listing files: {e}")
        return {"files": [], "folders": []}


@authenticated_router.get("/files/upload")
def get_upload_url(
    auth: CognitoToken = Depends(cognito_default.auth_required),
    file_name: str = Query(..., description="The name of the file to upload."),
    file_type: str = Query(...,
                           description="The content type of the file to upload."),
    file_size: int = Query(...,
                           description="The size of the file to upload in bytes."),
    prefix: Optional[str] = Query(
        None, description="The prefix to upload the file to. For example, 'my/folder'"),
):
    user_id = auth.sub
    path = f"{user_id}/{prefix}/{file_name}" if prefix else f"{user_id}/{file_name}"
    return utils.get_put_presigned_url(path, file_type, file_size)


@authenticated_router.get("/files/download")
def get_download_url(
    auth: CognitoToken = Depends(cognito_default.auth_required),
    key: str = Query(..., description="The key of the file to download."),
):
    user_id = auth.sub
    if not key.startswith(user_id):
        return {"error": "You do not have permission to access this file."}
    return utils.get_get_presigned_url(key)
