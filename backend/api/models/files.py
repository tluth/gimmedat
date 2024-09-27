from typing import Optional

from pydantic import BaseModel, AnyUrl, Field, EmailStr

from ..config import appconfig


class UploadFileRequest(BaseModel):
    file_name: str
    byte_size: int = Field(None, ge=1, le=appconfig.file_size_limit)
    file_type: str
    recipient_email: Optional[EmailStr] = Field(default=None)
    sender: Optional[str] = Field(default=None)


class UploadFileResponse(BaseModel):
    presigned_upload_data: dict
    uuid: str


class GetFileResponse(BaseModel):
    presigned_url: AnyUrl
    ttl: int
