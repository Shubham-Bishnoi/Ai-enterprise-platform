from __future__ import annotations

from dataclasses import dataclass
from typing import Protocol


class EmailProvider(Protocol):
    def send_email(self, *, to_email: str, subject: str, html: str, text: str | None = None) -> None: ...


@dataclass
class ResendProviderConfig:
    api_key: str | None = None


class ResendEmailProvider:
    def __init__(self, config: ResendProviderConfig) -> None:
        self.config = config

    def send_email(self, *, to_email: str, subject: str, html: str, text: str | None = None) -> None:
        _ = (to_email, subject, html, text, self.config.api_key)
        return None


@dataclass
class SendGridProviderConfig:
    api_key: str | None = None


class SendGridEmailProvider:
    def __init__(self, config: SendGridProviderConfig) -> None:
        self.config = config

    def send_email(self, *, to_email: str, subject: str, html: str, text: str | None = None) -> None:
        _ = (to_email, subject, html, text, self.config.api_key)
        return None


@dataclass
class SESProviderConfig:
    access_key_id: str | None = None
    secret_access_key: str | None = None
    region: str | None = None


class SESEmailProvider:
    def __init__(self, config: SESProviderConfig) -> None:
        self.config = config

    def send_email(self, *, to_email: str, subject: str, html: str, text: str | None = None) -> None:
        _ = (to_email, subject, html, text, self.config.access_key_id, self.config.secret_access_key, self.config.region)
        return None
