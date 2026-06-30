from gff_ai.schemas.handoff import HandoffPayload
from gff_ai.schemas.profile import ExtractedProfile


def build_handoff_payload(*, route: str, profile: ExtractedProfile, notes: str | None = None) -> HandoffPayload:
    summary = (
        f"Discovery session routed to {route}. "
        f"Industry={profile.industry or 'unknown'}, role={profile.role or 'unknown'}, "
        f"objective={profile.objective or 'needs clarification'}."
    )
    return HandoffPayload(
        summary=summary,
        recommended_contact=f"{route}_specialist_team",
        artifacts=["discovery_profile", "recommended_paths", "next_actions"],
        notes=notes,
    )
