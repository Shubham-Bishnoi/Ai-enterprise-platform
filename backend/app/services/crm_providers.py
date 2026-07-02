from __future__ import annotations

from dataclasses import dataclass
from typing import Protocol


class CRMProvider(Protocol):
    def upsert_lead(self, *, email: str, payload: dict) -> dict: ...


@dataclass
class HubSpotConfig:
    api_key: str | None = None


class HubSpotProvider:
    def __init__(self, config: HubSpotConfig) -> None:
        self.config = config

    def upsert_lead(self, *, email: str, payload: dict) -> dict:
        _ = (email, payload, self.config.api_key)
        return {"status": "todo", "provider": "hubspot"}


@dataclass
class SalesforceConfig:
    client_id: str | None = None
    client_secret: str | None = None


class SalesforceProvider:
    def __init__(self, config: SalesforceConfig) -> None:
        self.config = config

    def upsert_lead(self, *, email: str, payload: dict) -> dict:
        _ = (email, payload, self.config.client_id, self.config.client_secret)
        return {"status": "todo", "provider": "salesforce"}


@dataclass
class ZohoConfig:
    client_id: str | None = None
    client_secret: str | None = None


class ZohoProvider:
    def __init__(self, config: ZohoConfig) -> None:
        self.config = config

    def upsert_lead(self, *, email: str, payload: dict) -> dict:
        _ = (email, payload, self.config.client_id, self.config.client_secret)
        return {"status": "todo", "provider": "zoho"}
