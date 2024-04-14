from pynamodb.attributes import NumberAttribute
from pynamodb.models import Model
import pendulum


def get_expiry_date() -> int:
    now = pendulum.now()
    expiry = now + pendulum.duration(days=2)
    return expiry.int_timestamp


class BaseModel(Model):
    class Meta:
        region = "eu-central-1"
        table_name = "dynamodb-table"

    expire_at = NumberAttribute(null=False)

    def save(self, conditional_operator=None, **expected_values):
        self.expire_at = get_expiry_date()
        super().save()

    def as_dict(self):
        """
        Takes the current model and reviews the attributes to then translate to a dict
        """
        return {key: getattr(self, key) for key in self.get_attributes().keys()}
