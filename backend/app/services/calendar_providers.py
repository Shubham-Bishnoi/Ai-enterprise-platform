from __future__ import annotations

from dataclasses import dataclass
from typing import Protocol


class CalendarProvider(Protocol):
    def create_event(self, *, title: str, start_iso: str, end_iso: str, attendees: list[str]) -> dict: ...


@dataclass
class GoogleCalendarConfig:
    client_id: str | None = None
    client_secret: str | None = None


class GoogleCalendarProvider:
    def __init__(self, config: GoogleCalendarConfig) -> None:
        self.config = config

    def create_event(self, *, title: str, start_iso: str, end_iso: str, attendees: list[str]) -> dict:
        _ = (title, start_iso, end_iso, attendees, self.config.client_id, self.config.client_secret)
        return {"status": "todo", "provider": "google_calendar"}


@dataclass
class CalendlyConfig:
    api_key: str | None = None


class CalendlyProvider:
    def __init__(self, config: CalendlyConfig) -> None:
        self.config = config

    def create_event(self, *, title: str, start_iso: str, end_iso: str, attendees: list[str]) -> dict:
        _ = (title, start_iso, end_iso, attendees, self.config.api_key)
        return {"status": "todo", "provider": "calendly"}


@dataclass
class MicrosoftOutlookConfig:
    client_id: str | None = None
    client_secret: str | None = None


class MicrosoftOutlookProvider:
    def __init__(self, config: MicrosoftOutlookConfig) -> None:
        self.config = config

    def create_event(self, *, title: str, start_iso: str, end_iso: str, attendees: list[str]) -> dict:
        _ = (title, start_iso, end_iso, attendees, self.config.client_id, self.config.client_secret)
        return {"status": "todo", "provider": "microsoft_outlook"}
