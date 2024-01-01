#!/bin/env python3

import os
import sys
import fire
import uuid
from datetime import datetime, timedelta


# Hack to use dependencies from lib directory
BASE_PATH = os.path.dirname(__file__)
# ensure our packages override the systems
sys.path.insert(0, BASE_PATH + "/../")

from apitoken.base62token import Base62Token  # nopep8
from models.tenant import Tenant  # nopep8
from models.rolemappings import TokenRoleMapping, AzureRoleMapping  # nopep8


class AuthCli(object):

    def __init__(self, region="eu-west-1", product="geodataingest", environment="dev", expires=365):

        # default aws region to talk to
        self._region = region

        # default length in days of a token
        self._expires = expires

        # the default tablename
        self._tablename = f"adp-{product}-{environment}-auth"

    def tenant(self, name: str):
        """
        Adds a new tenant to the database
        :param name: the descriptive name for the tenant
        :return: the generated tenant id
        """

        tenant_id = uuid.uuid4()
        tenant = Tenant(
            tenant=str(tenant_id),
            name=name,
        )

        tenant.setup_model(Tenant,
                           region=self._region,
                           table_name=self._tablename
                           )

        tenant.save()

        return f"created tenant id: {tenant_id}"

    def azure(self, tenant: str, azureuid: str, principle: str, role: str):
        """
        Adds a azure principle to role mapping
        :param tenant: the tenant to add the principle to role mapping
        :param azureuid: the azure user object id
        :param principle: the azure user email address
        :param role: the role to add
        :return: the added role
        """

        azrole = AzureRoleMapping(
            tenant=tenant,
            uid=azureuid,
            role=role,
            principle=principle,
            active=True,
        )

        azrole.setup_model(AzureRoleMapping,
                           region=self._region,
                           table_name=self._tablename
                           )

        azrole.save()

        return f"added azure role mapping between {principle} -> {role}"

    def token(self, tenant: str, principle: str, role: str):
        """
        Adds a token to role mapping
        :param tenant: the tenant to add the principle to role mapping
        :param principle: the azure user email address
        :param role: the role to add
        :return: the added role
        """
        b62token = Base62Token()

        apikey = b62token.generate("adp")

        tokenrole = TokenRoleMapping(
            tenant=tenant,
            token=apikey,
            expires=datetime.now() + timedelta(days=self._expires),
            role=role,
            principle=principle,
            active=True,
        )

        tokenrole.setup_model(TokenRoleMapping,
                              region=self._region,
                              table_name=self._tablename
                              )

        tokenrole.save()

        return f"added api role mapping between {apikey} -> {role}"


def main():
    fire.Fire(AuthCli)


if __name__ == '__main__':
    main()
