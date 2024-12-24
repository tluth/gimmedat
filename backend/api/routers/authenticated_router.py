from fastapi_cognito import CognitoToken
from fastapi import Depends

from .trailingslash_router import APIRouter
from api.services.auth_service import cognito_default

authenticated_router = APIRouter()


@authenticated_router.get("/testo")
def hello_world(auth: CognitoToken = Depends(cognito_default.auth_required)):
    return {"message": "Hello world"}