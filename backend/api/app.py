import logging

from fastapi import FastAPI, Request, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse

from api.routers.public_router import main_router
from api.routers.authenticated_router import authenticated_router

logging.Logger.root.level = 10


def create_api():
    ###########################################################################
    #   Application object                                                    #
    ###########################################################################

    app = FastAPI(
        title="Gimmedat API",
        description="",
        contact={"github": "tluth"},
        version="0.1",
        debug=True
    )

    @app.exception_handler(RequestValidationError)
    async def validation_exception_handler(
            request: Request,
            exc: RequestValidationError):
        exc_str = f'{exc}'.replace('\n', ' ').replace('   ', ' ')
        logging.error(f"{request}: {exc_str}")
        content = {'status_code': 10422, 'message': exc_str, 'data': None}
        return JSONResponse(
            content=content,
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY
        )

    ###########################################################################
    #   Middleware                                                            #
    ###########################################################################
    app.add_middleware(
        CORSMiddleware,
        allow_origins=["*"],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    ###########################################################################
    #   Routers configuration                                                 #
    ###########################################################################

    app.include_router(main_router)
    app.include_router(authenticated_router)

    return app
