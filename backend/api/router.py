import logging
from uuid import uuid4
from typing import Any

from fastapi import HTTPException

from .config import appconfig
from .db.files import file_db
from .trailingslash_router import APIRouter
from .models import (
    UploadFileRequest,
    UploadFileResponse,
    GetFileResponse
)
from .utils import get_put_presigned_url, get_get_presigned_url

logger = logging.getLogger(__name__)

main_router = APIRouter()



@main_router.post("/file")
def upload_file(data: UploadFileRequest) -> UploadFileResponse:
    file_id = uuid4()
    s3_path = f"{file_id}/{data.file_name}"
    db_record = file_db(
        file_id=str(file_id),
        s3_path=s3_path,
    )
    put_presign = get_put_presigned_url(s3_path, data.file_type)
    db_record.save()
    return UploadFileResponse(
        presigned_upload_url= put_presign,
        uuid=str(file_id)
    )


@main_router.get("/file/{file_id}")
def get_file(file_id: str) -> GetFileResponse:
    file_record = file_db.query(file_id, limit=1)
    s3_key = file_record.next().as_dict().get("s3_path")
    if not s3_key: 
        raise HTTPException(
            status_code=500,
            detail="Error fetching file data."
        )
    presigned_url = get_get_presigned_url(s3_key)
    return GetFileResponse(
        presigned_url=presigned_url
    )