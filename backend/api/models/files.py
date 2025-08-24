from typing import Optional, List

from pydantic import BaseModel, AnyUrl, Field, EmailStr

from ..config import appconfig


class UploadFileRequest(BaseModel):
    file_name: str
    byte_size: int = Field(None, ge=1, le=appconfig.file_size_limit)
    file_type: str
    recipient_email: Optional[EmailStr] = Field(default=None)
    sender: Optional[str] = Field(default=None)
    folder_prefix: Optional[str] = None


class UploadFileResponse(BaseModel):
    presigned_upload_data: dict
    uuid: Optional[str] = None


class PermanentUploadFileResponse(BaseModel):
    presigned_upload_data: dict


class GetFileResponse(BaseModel):
    presigned_url: AnyUrl
    ttl: int


class FileItem(BaseModel):
    key: str
    name: str
    size: str
    last_modified: str
    storage_class: str
    type: str


class FileBrowserResponse(BaseModel):
    files: List[FileItem]
    folders: List[str]
