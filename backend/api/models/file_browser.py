from pydantic import BaseModel
from typing import List


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
