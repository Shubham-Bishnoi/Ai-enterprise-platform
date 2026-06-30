import pytest

from gff_ai.config import get_ai_settings


@pytest.fixture(autouse=True)
def force_mock_mode(monkeypatch):
    monkeypatch.setenv("ENABLE_AI_MOCK_MODE", "true")
    monkeypatch.setenv("AI_PROVIDER", "mock")
    get_ai_settings.cache_clear()
    yield
    get_ai_settings.cache_clear()
