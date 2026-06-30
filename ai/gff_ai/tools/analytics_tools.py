def build_ai_event_payload(*, route: str, confidence_score: float, missing_fields: list[str]) -> dict:
    return {
        "route": route,
        "confidence_score": confidence_score,
        "missing_fields": missing_fields,
    }
