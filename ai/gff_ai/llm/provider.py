from gff_ai.config import get_ai_settings
from gff_ai.llm.mock_client import MockLLMClient
from gff_ai.llm.nvidia_client import NvidiaClient
from gff_ai.llm.openai_client import OpenAIClient


def get_llm_client() -> MockLLMClient | OpenAIClient | NvidiaClient:
    settings = get_ai_settings()
    provider = settings.ai_provider.lower()

    if settings.enable_ai_mock_mode or provider == "mock":
        return MockLLMClient()

    if provider == "nvidia" or (provider == "openai" and not settings.openai_api_key and settings.nvidia_api_key):
        return NvidiaClient(
            api_key=settings.nvidia_api_key,
            model=settings.nvidia_model,
            base_url=settings.nvidia_base_url,
        )

    return OpenAIClient(
        api_key=settings.openai_api_key,
        model=settings.openai_model,
        base_url=settings.openai_base_url,
    )
