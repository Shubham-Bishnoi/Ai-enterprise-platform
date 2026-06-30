from gff_ai.schemas.profile import ExtractedProfile


class MockLLMClient:
    def generate_specialist_response(
        self,
        *,
        route: str,
        profile: ExtractedProfile,
        confidence_score: float,
        latest_user_message: str,
    ) -> str:
        if confidence_score < 0.65:
            options = ", ".join(
                value for value in [route.title(), "Strategy", "Industry"] if value
            )
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
