from functools import lru_cache

from pydantic_settings import BaseSettings, SettingsConfigDict


class AISettings(BaseSettings):
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

    model_config = SettingsConfigDict(
        env_file=(".env", "backend/.env", "ai/.env", "AI/.env"),
        env_file_encoding="utf-8",
        extra="ignore",
        case_sensitive=False,
    )


@lru_cache
def get_ai_settings() -> AISettings:
    return AISettings()
