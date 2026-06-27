import logging
import traceback
from fastapi import Request
from fastapi.responses import JSONResponse
from starlette.middleware.base import BaseHTTPMiddleware
from starlette.types import ASGIApp

logger = logging.getLogger("app.middleware.error")

class ErrorHandlingMiddleware(BaseHTTPMiddleware):
    def __init__(self, app: ASGIApp):
        super().__init__(app)

    async def dispatch(self, request: Request, call_next):
        try:
            response = await call_next(request)
            return response
        except Exception as exc:
            logger.error(f"Unhandled exception occurred: {str(exc)}")
            logger.error(traceback.format_exc())
            
            # Return a structured JSON response for unhandled errors
            response = JSONResponse(
                status_code=500,
                content={
                    "status": "error",
                    "message": "Internal Server Error",
                    "details": str(exc) if not request.app.debug else traceback.format_exc().split("\n")
                }
            )
            response.headers["Access-Control-Allow-Origin"] = request.headers.get("origin", "*")
            response.headers["Access-Control-Allow-Credentials"] = "true"
            response.headers["Access-Control-Allow-Methods"] = "*"
            response.headers["Access-Control-Allow-Headers"] = "*"
            return response
