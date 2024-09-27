from pynamodb.attributes import NumberAttribute, UnicodeAttribute

from ...config import appconfig
from .base import get_expiry_date
from .constantkey import HashKey, RangeKey
from .base import BaseModel
from .typefactory import ModelTypeFactory


class FileModel(BaseModel):
    file_id = HashKey(attr_name="file_id")
    s3_path = RangeKey(attr_name="s3_path")
    recipient_email = UnicodeAttribute(
        attr_name="recipient_email", null=True)
    sender = UnicodeAttribute(
        attr_name="sender", null=True)
    expire_at = NumberAttribute(attr_name="expire_at", default=get_expiry_date)

    def validate_fields(self):
        """
            Ensure that you can't have recipient_email without sender and vice/versa
        """
        if (self.recipient_email is None) != (self.sender is None):
            raise ValueError(
                "'sender' field is required if 'recipient_email' is not null."
            )

    def save(self, *args, **kwargs):
        self.validate_fields()
        super().save(*args, **kwargs)


def get_new_files_model() -> FileModel:
    return ModelTypeFactory(FileModel).create(
        appconfig.files_table_name, appconfig.aws_region
    )


file_db = get_new_files_model()
