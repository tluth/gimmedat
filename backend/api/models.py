from pydantic import BaseModel, AnyUrl, Field

from .config import appconfig


class UploadFileRequest(BaseModel):
    file_name: str
    byte_size: int = Field(None, ge=1, le=appconfig.file_size_limit)
    file_type: str


class UploadFileResponse(BaseModel):
    presigned_upload_url: AnyUrl
    uuid: str


class GetFileResponse(BaseModel):
    presigned_url: AnyUrl
