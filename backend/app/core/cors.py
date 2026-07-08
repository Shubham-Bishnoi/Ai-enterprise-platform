from fastapi.middleware.cors import CORSMiddleware
from fastapi import FastAPI

from app.core.config import Settings


def add_cors_middleware(app: FastAPI, settings: Settings) -> None:
    origins = [origin.strip() for origin in settings.backend_cors_origins if origin.strip()]
    allow_all_origins = "*" in origins and (
        settings.debug or settings.environment.lower() != "production"
    )
    allow_origins = ["*"] if allow_all_origins else [origin for origin in origins if origin != "*"]

    app.add_middleware(
        CORSMiddleware,
        allow_origins=allow_origins,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )
