from uuid import uuid4
import logging
from typing import List, Optional

from fastapi_cognito import CognitoToken
from fastapi import HTTPException, Request, status, Depends, Query
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from botocore.exceptions import ClientError

from .trailingslash_router import APIRouter
from api.services.auth_service import cognito_default
from ..config import appconfig
from ..models.files import FileBrowserResponse, UploadFileResponse, UploadFileRequest
from ..services.s3_services import list_s3_bucket_items
from ..utils import (
    get_put_permanent_presigned_url,
)


authenticated_router = APIRouter()
logger = logging.getLogger(__name__)


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


@authenticated_router.post(
    "/files/upload",
    response_model=UploadFileResponse,
)
def get_upload_url(
    data: UploadFileRequest,
    request: Request,
    auth: CognitoToken = Depends(cognito_default.auth_required),
) -> UploadFileResponse:
    """
    Generate presigned URL for authenticated file upload
    """
    if data.byte_size > int(appconfig.file_size_limit):
        raise HTTPException(
            status_code=400,
            detail="Invalid file size.",
        )

    # For authenticated uploads, you might want to organize by user
    # Assuming you have a folder_prefix in the request data
    folder_prefix = getattr(data, 'folder_prefix', '')
    if folder_prefix:
        s3_path = f"{folder_prefix}/{data.file_name}"
    else:
        s3_path = f"{auth.username}/{data.file_name}"

    logger.info(f"Authenticated upload for user: {auth.username}")

    post_presign = get_put_permanent_presigned_url(
        appconfig.permanent_storage_bucket, s3_path, data.file_type, data.byte_size
    )

    return UploadFileResponse(
        presigned_upload_data=post_presign,
    )
