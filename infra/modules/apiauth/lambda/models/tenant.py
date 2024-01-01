from datetime import datetime

from pynamodb.attributes import (
    UnicodeAttribute,
    UTCDateTimeAttribute,
    NumberAttribute
)
from pynamodb.models import Model
from .attributes.constantkey import (
    HashKey,
    RangeKey,
)


class Tenant(Model):
    class Meta:
        region = 'localhost'
        host = 'http://localhost:8000'

    tenant = HashKey(
        attr_name='PK'
    )

    _rk = RangeKey(
        value='tenant',
        attr_name='SK'
    )

    organisation = NumberAttribute(default=1)
    created_at = UTCDateTimeAttribute(null=False, default=datetime.utcnow)
    # name of our tenant
    name = UnicodeAttribute(null=False)

    @staticmethod
    def setup_model(model, region, table_name, is_remote=True):
        model.Meta.table_name = table_name
        model.Meta.region = region
        if is_remote:
            model.Meta.host = 'https://dynamodb.{0}.amazonaws.com'.format(
                region)
