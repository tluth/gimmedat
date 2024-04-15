from pynamodb.attributes import NumberAttribute

from ..config import appconfig
from .base import get_expiry_date
from .constantkey import HashKey, RangeKey
from .base import BaseModel
from .typefactory import ModelTypeFactory


class FileModel(BaseModel):
    file_id = HashKey(attr_name="file_id")

    s3_path = RangeKey(attr_name="s3_path")

    expire_at = NumberAttribute(attr_name="expire_at", default=get_expiry_date)


def get_new_files_model() -> FileModel:
    return ModelTypeFactory(FileModel).create(
        appconfig.files_table_name, appconfig.aws_region
    )


file_db = get_new_files_model()
