import pytest

from fastapi.testclient import TestClient
import boto3
from botocore.stub import Stubber

from ..api.app import create_api
from ..api.utils import s3_con


@pytest.fixture()
def http_client() -> TestClient:
    app = create_api()
    return TestClient(app)



# https://adamj.eu/tech/2019/04/22/testing-boto3-with-pytest-fixtures/
@pytest.fixture(autouse=True)
def s3_stub():
    stubber = Stubber(s3_con)
    with Stubber(s3.meta.client) as stubber:
        yield stubber
        stubber.assert_no_pending_responses()
