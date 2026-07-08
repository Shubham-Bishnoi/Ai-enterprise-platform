from gff_ai.config import get_ai_settings
from gff_ai.llm.mock_client import MockLLMClient
from gff_ai.llm.nvidia_client import NvidiaClient
from gff_ai.llm.openai_client import OpenAIClient


class FallbackLLMClient:
    def __init__(
        self,
        *,
        primary: OpenAIClient | NvidiaClient,
        fallback: OpenAIClient | NvidiaClient | None = None,
    ) -> None:
        self.primary = primary
        self.fallback = fallback

    def generate_specialist_response(self, **kwargs) -> str:
        try:
            return self.primary.generate_specialist_response(**kwargs)
        except Exception:
            if not self.fallback:
                raise
            return self.fallback.generate_specialist_response(**kwargs)

    def generate_blueprint_summary(self, **kwargs) -> str:
        try:
            return self.primary.generate_blueprint_summary(**kwargs)
        except Exception:
            if not self.fallback:
                raise
            return self.fallback.generate_blueprint_summary(**kwargs)


def get_llm_client() -> MockLLMClient | OpenAIClient | NvidiaClient | FallbackLLMClient:
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

    openai_client = OpenAIClient(
        api_key=settings.openai_api_key,
        model=settings.openai_model,
        base_url=settings.openai_base_url,
    )
    if provider == "openai" and settings.nvidia_api_key:
        return FallbackLLMClient(
            primary=openai_client,
            fallback=NvidiaClient(
                api_key=settings.nvidia_api_key,
                model=settings.nvidia_model,
                base_url=settings.nvidia_base_url,
            ),
        )
    return openai_client
