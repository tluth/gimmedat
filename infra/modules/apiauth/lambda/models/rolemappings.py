from datetime import datetime

from pynamodb.attributes import (
    UnicodeAttribute,
    UTCDateTimeAttribute,
    BooleanAttribute
)
from pynamodb.models import Model
from .attributes.constantkey import (
    HashKey,
    RangeKey,
)


class BaseRoleMapping(Model):
    class Meta:
        region = 'localhost'
        host = 'http://localhost:8000'

    tenant = HashKey(
        attr_name='PK'
    )

    created_at = UTCDateTimeAttribute(null=False, default=datetime.utcnow)
    updated_at = UTCDateTimeAttribute(null=False)

    def save(self, conditional_operator=None, **expected_values):
        self.updated_at = datetime.utcnow()
        super().save()

    @staticmethod
    def setup_model(model, region, table_name, is_remote=True):
        model.Meta.table_name = table_name
        model.Meta.region = region
        if is_remote:
            model.Meta.host = 'https://dynamodb.{0}.amazonaws.com'.format(
                region)


class TokenRoleMapping(BaseRoleMapping):

    token = RangeKey(
        prefix_str='token',
        attr_name='SK'
    )

    # how long is the token valid for
    expires = UTCDateTimeAttribute(null=False)
    # bool to disabled the role auth
    active = BooleanAttribute(null=False, default=False)
    # our Azure Principle / UPN
    principle = UnicodeAttribute(null=False)
    # the role assigned to the principle
    role = UnicodeAttribute(null=False)
    # free text commentary field
    comment = UnicodeAttribute(null=True)


class AzureRoleMapping(BaseRoleMapping):

    uid = RangeKey(
        prefix_str='azure',
        attr_name='SK'
    )

    # bool to disabled the role auth
    active = BooleanAttribute(null=False, default=False)
    # our Azure Principle / UPN
    principle = UnicodeAttribute(null=False)
    # the role assigned to the principle
    role = UnicodeAttribute(null=False)
    # free text commentary field
    comment = UnicodeAttribute(null=True)
