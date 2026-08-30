from __future__ import annotations

import logging
from dataclasses import dataclass
from typing import Protocol

import httpx

logger = logging.getLogger("app.email")

RESEND_API_URL = "https://api.resend.com/emails"
REQUEST_TIMEOUT_SECONDS = 20.0


class EmailDeliveryError(Exception):
    """Raised when a provider could not deliver. `retryable` drives backoff."""

    def __init__(self, message: str, *, retryable: bool) -> None:
        super().__init__(message)
        self.retryable = retryable


class EmailProvider(Protocol):
    def send_email(
        self, *, from_email: str, to_emails: list[str], subject: str, html: str, text: str | None = None
    ) -> str | None:
        """Send one email. Returns the provider message id when available."""
        ...


@dataclass
class ResendProviderConfig:
    api_key: str | None = None


def _post_resend(api_key: str, body: dict) -> httpx.Response:
    """Isolated so tests can monkeypatch the network call."""
    with httpx.Client(timeout=REQUEST_TIMEOUT_SECONDS) as client:
        return client.post(
            RESEND_API_URL,
            json=body,
            headers={"Authorization": f"Bearer {api_key}", "Content-Type": "application/json"},
        )


class ResendEmailProvider:
    def __init__(self, config: ResendProviderConfig) -> None:
        self.config = config

    def send_email(
        self, *, from_email: str, to_emails: list[str], subject: str, html: str, text: str | None = None
    ) -> str | None:
        if not self.config.api_key:
            raise EmailDeliveryError("RESEND_API_KEY is not configured.", retryable=False)

        body: dict = {"from": from_email, "to": to_emails, "subject": subject, "html": html}
        if text:
            body["text"] = text

        try:
            response = _post_resend(self.config.api_key, body)
        except httpx.HTTPError as exc:
            raise EmailDeliveryError(f"network: {type(exc).__name__}", retryable=True) from exc

        if 200 <= response.status_code < 300:
            try:
                message_id = response.json().get("id")
            except ValueError:
                message_id = None
            logger.info("email sent provider=resend message_id=%s", message_id)
            return message_id

        retryable = response.status_code >= 500 or response.status_code == 429
        # Never log the response body — it can echo recipient addresses.
        raise EmailDeliveryError(f"resend http {response.status_code}", retryable=retryable)


class LoggingEmailProvider:
    """Development fallback: records the send instead of delivering it."""

    def send_email(
        self, *, from_email: str, to_emails: list[str], subject: str, html: str, text: str | None = None
    ) -> str | None:
        _ = (html, text)
        logger.info("email (logging provider) from=%s to=%s subject=%s", from_email, len(to_emails), subject)
        return None


def build_email_provider(settings) -> EmailProvider:
    if settings.resend_api_key:
        return ResendEmailProvider(ResendProviderConfig(api_key=settings.resend_api_key))
    return LoggingEmailProvider()
