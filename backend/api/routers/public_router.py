import logging
from uuid import uuid4

from fastapi import HTTPException, Request, status

from ..config import appconfig
from ..models.db.files import file_db
from ..trailingslash_router import APIRouter
from ..models.files import (
    UploadFileRequest,
    UploadFileResponse,
    GetFileResponse
)
from ..utils import (
    get_put_presigned_url,
    get_get_presigned_url,
    calc_ttl_seconds,
    blacklist_lookup
)


logger = logging.getLogger(__name__)

main_router = APIRouter()


@main_router.post(
    "/file",
    response_model=UploadFileResponse,
)
def upload_file(
    data: UploadFileRequest,
    request: Request,
) -> UploadFileResponse:
    if blacklist_lookup(request.client.host):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Forbidden"
        )

    if data.byte_size > int(appconfig.file_size_limit):
        raise HTTPException(
            status_code=400,
            detail="Invalid file size.",
        )
    file_id = uuid4()
    s3_path = f"{file_id}/{data.file_name}"
    db_record = file_db(
        file_id=str(file_id),
        s3_path=s3_path,
        recipient_email=data.recipient_email,
        sender=data.sender
    )
    post_presign = get_put_presigned_url(
        s3_path, data.file_type, data.byte_size)
    db_record.save()
    return UploadFileResponse(
        presigned_upload_data=post_presign,
        uuid=str(file_id)
    )


@main_router.get("/file/{file_id}")
def get_file(file_id: str) -> GetFileResponse:
    query_results = file_db.query(file_id, limit=1)
    file_record = next(query_results, None)
    if not file_record:
        raise HTTPException(
            status_code=410,
            detail="The file cannot be found. It has likely expired."
        )
    s3_key = file_record.s3_path
    if not s3_key:
        raise HTTPException(
            status_code=500,
            detail="Error fetching file data."
        )
    presigned_url = get_get_presigned_url(s3_key)
    return GetFileResponse(
        presigned_url=presigned_url,
        ttl=calc_ttl_seconds(file_record.expire_at)
    )
