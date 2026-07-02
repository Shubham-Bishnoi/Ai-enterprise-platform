import json

from openai import OpenAI
from pydantic import BaseModel, Field

from gff_ai.schemas.blueprint import BlueprintOutput
from gff_ai.schemas.profile import ExtractedProfile
from gff_ai.schemas.profile import BlueprintProfile


class SpecialistResponsePayload(BaseModel):
    specialist_response: str = Field(min_length=1)
    reasoning_summary: str = Field(min_length=1)
    suggested_questions: list[str] = Field(default_factory=list)


class BlueprintSummaryPayload(BaseModel):
    profile_summary: str = Field(min_length=1)


class OpenAIClient:
    def __init__(self, api_key: str | None, model: str, base_url: str | None = None) -> None:
        self.api_key = api_key
        self.model = model
        self.base_url = base_url

    def _build_messages(
        self,
        *,
        route: str,
        profile: ExtractedProfile,
        confidence_score: float,
        latest_user_message: str,
    ) -> list[dict[str, str]]:
        return [
            {
                "role": "system",
                "content": (
                    "You are the GFF AI discovery specialist. "
                    "Respond with strict JSON only using keys: "
                    "specialist_response, reasoning_summary, suggested_questions. "
                    "Keep the response concise, enterprise-grade, and truthful."
                ),
            },
            {
                "role": "user",
                "content": json.dumps(
                    {
                        "selected_route": route,
                        "confidence_score": confidence_score,
                        "latest_user_message": latest_user_message,
                        "profile": profile.model_dump(),
                    }
                ),
            },
        ]

    def _parse_payload(self, content: str | None) -> SpecialistResponsePayload:
        if not content:
            raise ValueError("Provider returned an empty response.")
        try:
            payload = json.loads(content)
        except json.JSONDecodeError:
            return SpecialistResponsePayload(
                specialist_response=content.strip(),
                reasoning_summary="Provider returned plain text instead of structured JSON.",
                suggested_questions=[],
            )

        if isinstance(payload, dict):
            if {"selected_route", "latest_user_message", "profile"}.issubset(payload.keys()):
                raise ValueError("Provider echoed the request payload instead of returning a specialist response.")

            if "specialist_response" in payload and "reasoning_summary" in payload:
                return SpecialistResponsePayload.model_validate(payload)

            fallback_text = (
                payload.get("message")
                or payload.get("content")
                or payload.get("response")
                or payload.get("prompt")
            )
            if isinstance(fallback_text, str) and fallback_text.strip():
                return SpecialistResponsePayload(
                    specialist_response=fallback_text.strip(),
                    reasoning_summary=(
                        payload.get("reasoning_summary")
                        or payload.get("summary")
                        or "Provider returned a compatible message payload."
                    ),
                    suggested_questions=payload.get("suggested_questions") or [],
                )

        raise ValueError("Provider response did not match the expected schema.")

    def _fallback_response(
        self,
        *,
        route: str,
        profile: ExtractedProfile,
        confidence_score: float,
    ) -> str:
        if confidence_score < 0.65:
            options = ", ".join(value for value in [route.title(), "Strategy", "Industry"] if value)
            return (
                "I can help, but I want to avoid over-routing too early. "
                f"Your request touches multiple paths, so I suggest we clarify the best route among {options}."
            )

        profile_summary = ", ".join(
            filter(
                None,
                [
                    f"industry={profile.industry}" if profile.industry else None,
                    f"role={profile.role}" if profile.role else None,
                    f"objective={profile.objective}" if profile.objective else None,
                    f"maturity={profile.ai_maturity}" if profile.ai_maturity else None,
                ],
            )
        )
        return (
            f"The {route} specialist path is the best fit for this request. "
            f"I've captured the current discovery profile ({profile_summary or 'limited profile data'}) "
            "and prepared next actions to move toward a recommendation or expert handoff."
        )

    def generate_specialist_response(
        self,
        *,
        route: str,
        profile: ExtractedProfile,
        confidence_score: float,
        latest_user_message: str,
    ) -> str:
        if not self.api_key:
            raise ValueError("OPENAI_API_KEY is required when mock mode is disabled.")
        client = OpenAI(api_key=self.api_key, base_url=self.base_url)
        response = client.chat.completions.create(
            model=self.model,
            temperature=0.2,
            response_format={"type": "json_object"},
            messages=self._build_messages(
                route=route,
                profile=profile,
                confidence_score=confidence_score,
                latest_user_message=latest_user_message,
            ),
        )
        try:
            payload = self._parse_payload(response.choices[0].message.content)
        except ValueError:
            return self._fallback_response(
                route=route,
                profile=profile,
                confidence_score=confidence_score,
            )
        if payload.suggested_questions:
            return f"{payload.specialist_response}\n\nSuggested follow-up: {payload.suggested_questions[0]}"
        return payload.specialist_response

    def generate_blueprint_summary(
        self,
        *,
        blueprint: BlueprintOutput,
        profile: BlueprintProfile,
    ) -> str:
        if not self.api_key:
            raise ValueError("OPENAI_API_KEY is required when mock mode is disabled.")
        client = OpenAI(api_key=self.api_key, base_url=self.base_url)
        response = client.chat.completions.create(
            model=self.model,
            temperature=0.2,
            response_format={"type": "json_object"},
            messages=[
                {
                    "role": "system",
                    "content": (
                        "You are the GFF AI blueprint summarizer. "
                        "Return strict JSON only with key profile_summary. "
                        "Be concise, enterprise-grade, deterministic in tone, and do not promise guaranteed ROI."
                    ),
                },
                {
                    "role": "user",
                    "content": json.dumps(
                        {
                            "profile": profile.model_dump(),
                            "readiness_category": blueprint.readiness_category,
                            "top_opportunities": [item.title for item in blueprint.top_opportunities[:3]],
                            "recommended_solutions": [item.name for item in blueprint.recommended_solutions[:3]],
                        }
                    ),
                },
            ],
        )
        content = response.choices[0].message.content
        if not content:
            raise ValueError("Provider returned an empty blueprint summary response.")
        payload = BlueprintSummaryPayload.model_validate(json.loads(content))
        return payload.profile_summary
