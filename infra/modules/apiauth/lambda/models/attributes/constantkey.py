
from pynamodb.attributes import UnicodeAttribute
from typing import Optional, Union, Any

# Single table https://github.com/pynamodb/PynamoDB/issues/686

# Based on https://gist.github.com/grvhi/78889f32b3701c421ef30e72aebc7f69
#


class ConstantKeyAttribute(UnicodeAttribute):
    """
    Base functionality applicable to both :class:`~common.keys.RangeKey` and
    :class:`~common.keys.HashKey`.
    """
    fixed_value: Optional[str]
    separator: str = '#'
    prefix_str: Optional[str]
    suffix_str: Optional[str]
    description: Optional[str]
    literal_type = str

    def __init__(self, prefix_str: Optional[str] = None,
                 value: Optional[str] = None,
                 suffix_str: Optional[str] = None,
                 description: Optional[str] = None, **kwargs):
        self.description = description
        self.fixed_value = value
        self.prefix_str = prefix_str
        self.suffix_str = suffix_str
        super().__init__(**kwargs)

    def __get__(self, instance, owner):
        if instance:
            # noinspection PyProtectedMember
            attr_name = instance._dynamo_to_python_attrs.get(
                self.attr_name,
                self.attr_name
            )
            value = instance.attribute_values.get(attr_name)
            if value is None and self.fixed_value:
                value = self.fixed_value
        else:
            value = self
        return value

    def __len__(self) -> int:
        if getattr(self, 'fixed_value', None):
            return len(self.fixed_value)
        else:
            return 0

    def __set__(self, instance, value):
        if instance:
            if getattr(self, 'fixed_value', None):
                value = self.fixed_value
            else:
                value = self._gen_value(value)
        super().__set__(instance, value)

    @classmethod
    def value_from_dict(cls, suffix: dict):
        return suffix

    def _gen_value(self, suffix: Union[str, dict]):
        if isinstance(suffix, dict):
            return self.value_from_dict(suffix)
        if self.prefix_str and self.prefix_str not in suffix:
            return f'{self.prefix_str}{self.separator}{suffix}'
        if self.suffix_str and self.suffix_str not in suffix:
            return f'{suffix}{self.separator}{self.suffix_str}'
        else:
            return suffix

    def serialize(self, value: Any = None):
        if getattr(value, 'fixed_value', None):
            return super().serialize(value.fixed_value)
        elif value:
            value = self._gen_value(value)
            return value
        else:
            return (
                self.fixed_value if getattr(self, 'fixed_value', None) else
                self.prefix_str if getattr(self, 'prefix_str', None) else
                self.suffix_str
            )


class RangeKey(ConstantKeyAttribute):

    def __init__(self, **kwargs):
        super().__init__(range_key=True, **kwargs)


class HashKey(ConstantKeyAttribute):

    def __init__(self, **kwargs):
        super().__init__(hash_key=True, **kwargs)
