from gff_ai.llm.provider import get_llm_client
from gff_ai.schemas.blueprint import BlueprintOutput
from gff_ai.schemas.profile import BlueprintProfile


def compose_blueprint_narrative(
    *,
    blueprint: BlueprintOutput,
    profile: BlueprintProfile,
) -> tuple[str, list[str]]:
    client = get_llm_client()
    if hasattr(client, "generate_blueprint_summary"):
        try:
            summary = client.generate_blueprint_summary(blueprint=blueprint, profile=profile)
            return summary, []
        except Exception as exc:  # pragma: no cover - defensive fallback
            return blueprint.profile_summary, [f"LLM synthesis fallback used after provider error: {exc}"]
    return blueprint.profile_summary, []
