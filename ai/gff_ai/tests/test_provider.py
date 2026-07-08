from gff_ai.config import get_ai_settings
from gff_ai.llm.mock_client import MockLLMClient
from gff_ai.llm.provider import FallbackLLMClient
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
    monkeypatch.setenv("OPENAI_API_KEY", "")
    monkeypatch.setenv("NVIDIA_API_KEY", "test-nvidia-key")
    get_ai_settings.cache_clear()

    client = get_llm_client()

    assert isinstance(client, NvidiaClient)
    get_ai_settings.cache_clear()


def test_provider_uses_openai_when_openai_key_available(monkeypatch):
    monkeypatch.setenv("ENABLE_AI_MOCK_MODE", "false")
    monkeypatch.setenv("AI_PROVIDER", "openai")
    monkeypatch.setenv("OPENAI_API_KEY", "test-openai-key")
    monkeypatch.setenv("NVIDIA_API_KEY", "test-nvidia-key")
    get_ai_settings.cache_clear()

    client = get_llm_client()

    assert isinstance(client, FallbackLLMClient)
    assert isinstance(client.primary, OpenAIClient)
    assert isinstance(client.fallback, NvidiaClient)
    get_ai_settings.cache_clear()


def test_provider_uses_openai_only_when_no_nvidia_key(monkeypatch):
    monkeypatch.setenv("ENABLE_AI_MOCK_MODE", "false")
    monkeypatch.setenv("AI_PROVIDER", "openai")
    monkeypatch.setenv("OPENAI_API_KEY", "test-openai-key")
    monkeypatch.setenv("NVIDIA_API_KEY", "")
    get_ai_settings.cache_clear()

    client = get_llm_client()

    assert isinstance(client, OpenAIClient)
    get_ai_settings.cache_clear()


def test_fallback_client_uses_nvidia_when_openai_call_fails():
    class FailingPrimary:
        def generate_specialist_response(self, **kwargs):
            raise RuntimeError("openai failed")

        def generate_blueprint_summary(self, **kwargs):
            raise RuntimeError("openai failed")

    class WorkingFallback:
        def generate_specialist_response(self, **kwargs):
            return "nvidia specialist response"

        def generate_blueprint_summary(self, **kwargs):
            return "nvidia blueprint summary"

    client = FallbackLLMClient(primary=FailingPrimary(), fallback=WorkingFallback())

    assert client.generate_specialist_response(route="strategy") == "nvidia specialist response"
    assert client.generate_blueprint_summary(blueprint=None, profile=None) == "nvidia blueprint summary"
    get_ai_settings.cache_clear()
