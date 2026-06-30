from typing import Any

from fastapi import FastAPI, HTTPException, Request, status
from fastapi.responses import JSONResponse
from pydantic import BaseModel


class ErrorDetail(BaseModel):
    code: str
    message: str
    details: dict[str, Any] | None = None


class ApiException(HTTPException):
    def __init__(
        self,
        *,
        status_code: int = status.HTTP_400_BAD_REQUEST,
        code: str = "bad_request",
        message: str = "Request failed.",
        details: dict[str, Any] | None = None,
    ) -> None:
        self.error = ErrorDetail(code=code, message=message, details=details)
        super().__init__(status_code=status_code, detail=self.error.model_dump())


def register_error_handlers(app: FastAPI) -> None:
    @app.exception_handler(ApiException)
    async def handle_api_exception(_: Request, exc: ApiException) -> JSONResponse:
        return JSONResponse(
            status_code=exc.status_code,
            content={
                "success": False,
                "data": None,
                "error": exc.error.model_dump(),
            },
        )

    @app.exception_handler(Exception)
    async def handle_unexpected_exception(_: Request, exc: Exception) -> JSONResponse:
        return JSONResponse(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            content={
                "success": False,
                "data": None,
                "error": ErrorDetail(
                    code="internal_error",
                    message="An unexpected error occurred.",
                    details={"reason": str(exc)},
                ).model_dump(),
            },
        )
