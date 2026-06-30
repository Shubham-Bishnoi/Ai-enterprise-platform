from gff_ai.config import get_ai_settings
from gff_ai.llm.mock_client import MockLLMClient
from gff_ai.llm.nvidia_client import NvidiaClient
from gff_ai.llm.openai_client import OpenAIClient
from gff_ai.llm.provider import get_llm_client


def test_provider_returns_mock_client_when_mock_mode_enabled(monkeypatch):
    monkeypatch.setenv("ENABLE_AI_MOCK_MODE", "true")
    monkeypatch.setenv("AI_PROVIDER", "openai")
    get_ai_settings.cache_clear()

    client = get_llm_client()

    assert isinstance(client, MockLLMClient)
    get_ai_settings.cache_clear()


def test_provider_falls_back_to_nvidia_when_openai_key_missing(monkeypatch):
    monkeypatch.setenv("ENABLE_AI_MOCK_MODE", "false")
    monkeypatch.setenv("AI_PROVIDER", "openai")
    monkeypatch.delenv("OPENAI_API_KEY", raising=False)
    monkeypatch.setenv("NVIDIA_API_KEY", "test-nvidia-key")
    get_ai_settings.cache_clear()

    client = get_llm_client()

    assert isinstance(client, NvidiaClient)
    get_ai_settings.cache_clear()


def test_provider_uses_openai_when_openai_key_available(monkeypatch):
    monkeypatch.setenv("ENABLE_AI_MOCK_MODE", "false")
    monkeypatch.setenv("AI_PROVIDER", "openai")
    monkeypatch.setenv("OPENAI_API_KEY", "test-openai-key")
    monkeypatch.delenv("NVIDIA_API_KEY", raising=False)
    get_ai_settings.cache_clear()

    client = get_llm_client()

    assert isinstance(client, OpenAIClient)
    get_ai_settings.cache_clear()
