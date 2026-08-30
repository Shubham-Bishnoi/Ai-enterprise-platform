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
    frontend_url: str | None = None
    enable_ai_mock_mode: bool = True
    ai_provider: str = "mock"
    openai_api_key: str | None = None
    openai_model: str = "gpt-5.4-mini"
    openai_router_model: str = "gpt-5.4-nano"
    openai_blueprint_model: str = "gpt-5.4-mini"
    openai_base_url: str | None = "https://api.openai.com/v1"
    nvidia_api_key: str | None = None
    nvidia_model: str = "meta/llama-3.1-8b-instruct"
    nvidia_base_url: str = "https://integrate.api.nvidia.com/v1"
    blueprint_engine_version: str = "v1"
    blueprint_default_industry: str = "generic-enterprise"

    # Excel reporting sync (Supabase -> outbox -> Power Automate -> workbook).
    excel_sync_enabled: bool = False
    excel_sync_webhook_url: str | None = None
    excel_sync_webhook_secret: str | None = None
    excel_sync_batch_size: int = 25
    excel_sync_max_attempts: int = 8
    excel_sync_poll_seconds: int = 30

    # Analytics ingestion hardening.
    analytics_rate_limit_per_minute: int = 120
    analytics_payload_max_bytes: int = 8192

    # Daily activity report (Supabase -> reporting query -> Resend email).
    report_enabled: bool = False
    report_recipients: str = ""  # comma-separated
    report_from_email: str = "GFF AI Reports <reports@gffai.ai>"
    report_timezone: str = "Asia/Kolkata"
    report_send_hour: int = 23  # local to report_timezone
    report_send_minute: int = 55
    report_max_attempts: int = 5
    report_poll_seconds: int = 60
    daily_report_secret: str | None = None  # protects the manual trigger endpoint
    report_test_recipient: str | None = None  # the ONLY address test reports may go to
    admin_dashboard_url: str | None = None  # linked from the report email when set

    secret_key: str = "dev-secret-change-me"
    redis_url: str | None = None
    email_provider: str | None = None
    resend_api_key: str | None = None
    storage_provider: str | None = None
    s3_bucket: str | None = None
    cloudflare_r2_bucket: str | None = None

    backend_cors_origins: Annotated[list[str], NoDecode] = [
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:3000",
        "http://127.0.0.1:3000",
    ]

    model_config = SettingsConfigDict(
        env_file=(".env", "backend/.env", "ai/.env", "AI/.env"),
        env_file_encoding="utf-8",
        extra="ignore",
        case_sensitive=False,
    )

    def report_recipient_list(self) -> list[str]:
        return [item.strip() for item in self.report_recipients.split(",") if item.strip()]

    @field_validator("backend_cors_origins", mode="before")
    @classmethod
    def parse_cors_origins(cls, value: object) -> list[str]:
        if isinstance(value, list):
            return value
        if isinstance(value, str):
            return [item.strip() for item in value.split(",") if item.strip()]
        raise TypeError("Invalid CORS origins format.")


@lru_cache
def get_settings() -> Settings:
    return Settings()
