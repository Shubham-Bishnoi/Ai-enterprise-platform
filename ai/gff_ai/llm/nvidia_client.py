from gff_ai.llm.openai_client import OpenAIClient


class NvidiaClient(OpenAIClient):
    def generate_specialist_response(
        self,
        *,
        route: str,
        profile,
        confidence_score: float,
        latest_user_message: str,
    ) -> str:
        if not self.api_key:
            raise ValueError("NVIDIA_API_KEY is required when NVIDIA provider mode is enabled.")
        return super().generate_specialist_response(
            route=route,
            profile=profile,
            confidence_score=confidence_score,
            latest_user_message=latest_user_message,
        )
