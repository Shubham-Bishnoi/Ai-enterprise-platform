from functools import lru_cache
from typing import Annotated

from pydantic import field_validator
from pydantic_settings import BaseSettings, NoDecode, SettingsConfigDict


class Settings(BaseSettings):
    app_name: str = "GFF AI Backend"
    api_v1_prefix: str = "/api/v1"
    environment: str = "development"
    debug: bool = False
    testing: bool = False

    database_url: str = "postgresql+psycopg://postgres:postgres@localhost:5432/gff_ai"
    enable_ai_mock_mode: bool = True
    ai_provider: str = "mock"
    openai_api_key: str | None = None
    openai_model: str = "gpt-4o-mini"
    openai_base_url: str | None = None
    nvidia_api_key: str | None = None
    nvidia_model: str = "meta/llama-3.1-8b-instruct"
    nvidia_base_url: str = "https://integrate.api.nvidia.com/v1"
    blueprint_engine_version: str = "v1"
    blueprint_default_industry: str = "generic-enterprise"

    secret_key: str = "dev-secret-change-me"

    backend_cors_origins: Annotated[list[str], NoDecode] = [
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ]

    model_config = SettingsConfigDict(
        env_file=(".env", "backend/.env"),
        env_file_encoding="utf-8",
        extra="ignore",
        case_sensitive=False,
    )

    @field_validator("backend_cors_origins", mode="before")
    @classmethod
    def parse_cors_origins(cls, value: str | list[str]) -> list[str]:
        if isinstance(value, list):
            return value
        if isinstance(value, str):
            return [item.strip() for item in value.split(",") if item.strip()]
        raise TypeError("Invalid CORS origins format.")


@lru_cache
def get_settings() -> Settings:
    return Settings()
