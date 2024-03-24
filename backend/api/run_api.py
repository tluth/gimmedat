import os

from dotenv import load_dotenv  # noqa: E402
from mangum import Mangum  # noqa: E402

from api.app import create_api

dir = os.path.dirname(os.path.abspath(__file__))
dotenv_path = os.path.join(dir, "../.env")


load_dotenv(dotenv_path, override=True)


app = create_api()

handler = Mangum(app)
