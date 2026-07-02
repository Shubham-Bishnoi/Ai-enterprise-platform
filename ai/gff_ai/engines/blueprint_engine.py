from datetime import datetime, timezone

from gff_ai.agents.blueprint import compose_blueprint_narrative
from gff_ai.engines.industry_pack_engine import choose_industry_pack
from gff_ai.engines.readiness_scoring import compute_readiness_score
from gff_ai.engines.recommendation_engine import recommend_blueprint_opportunities
from gff_ai.schemas.blueprint import BlueprintOutput
from gff_ai.schemas.blueprint import BlueprintState
from gff_ai.schemas.opportunity import BlueprintOpportunity
from gff_ai.schemas.profile import BlueprintProfile
from gff_ai.tools.architecture_tools import build_architecture_layers
from gff_ai.tools.blueprint_tools import (
    build_handoff_summary,
    build_next_actions,
    build_operating_model,
    build_recommended_agents,
    build_recommended_solutions,
    compose_profile_summary,
    estimate_business_impact,
)
from gff_ai.tools.governance_tools import build_governance_framework
from gff_ai.tools.roadmap_tools import build_roadmap_phases
from gff_ai.tools.scoring_tools import normalize_key


def validate_input(profile: BlueprintProfile) -> BlueprintProfile:
    if not profile.top_priorities:
        raise ValueError("top_priorities must not be empty.")
    return profile


def _default_data_readiness(journey_stage: str) -> str:
    if normalize_key(journey_stage) in {"scaling ai", "scaling", "ai-driven enterprise", "ai-native"}:
        return "Mostly integrated"
    if normalize_key(journey_stage) in {"running pilots", "piloting"}:
        return "Partially connected"
    return "Highly fragmented"


def _default_leadership_commitment(journey_stage: str) -> str:
    if normalize_key(journey_stage) in {"scaling ai", "scaling", "ai-driven enterprise", "ai-native"}:
        return "Budget Approved"
    if normalize_key(journey_stage) in {"running pilots", "piloting", "exploring ai", "exploring"}:
        return "Exploring"
    return "Not Discussed"


def normalize_profile(profile: BlueprintProfile) -> tuple[BlueprintProfile, list[str]]:
    assumptions: list[str] = []
    normalized = profile.model_copy(deep=True)
    normalized.top_priorities = list(dict.fromkeys(normalized.top_priorities))[:3]
    normalized.existing_systems = normalized.existing_systems or []
    if not normalized.data_readiness:
        normalized.data_readiness = _default_data_readiness(normalized.ai_journey_stage)
        assumptions.append("Data readiness defaulted conservatively from AI journey stage.")
    if not normalized.leadership_commitment:
        normalized.leadership_commitment = _default_leadership_commitment(normalized.ai_journey_stage)
        assumptions.append("Leadership commitment defaulted conservatively from AI journey stage.")
    if not normalized.risk_appetite:
        normalized.risk_appetite = "Conservative"
        assumptions.append("Risk appetite defaulted to Conservative.")
    return normalized, assumptions


def _filter_use_cases(*, pack_slug: str, use_cases: list[dict]) -> list[dict]:
    filtered = [
        use_case
        for use_case in use_cases
        if use_case.get("status") == "active"
        and (use_case.get("industry_slug") in {None, pack_slug, "generic-enterprise"})
    ]
    return sorted(
        filtered,
        key=lambda item: (item.get("impact_level", ""), item.get("time_to_value", "")),
        reverse=True,
    )


def generate_blueprint(
    *,
    profile: BlueprintProfile,
    industry_packs: list[dict],
    use_cases: list[dict],
    request_id: str | None = None,
    blueprint_id: str | None = None,
    default_industry_slug: str = "generic-enterprise",
) -> BlueprintOutput:
    validated = validate_input(profile)
    normalized, assumptions = normalize_profile(validated)
    readiness_score, readiness_category, readiness_breakdown = compute_readiness_score(normalized)
    industry_pack, pack_warnings = choose_industry_pack(
        industry=normalized.industry,
        industry_packs=industry_packs,
        default_slug=default_industry_slug,
    )
    pack_slug = industry_pack.get("slug", default_industry_slug)
    scoped_use_cases = _filter_use_cases(pack_slug=pack_slug, use_cases=use_cases)
    opportunities = [
        BlueprintOpportunity.model_validate(item)
        for item in recommend_blueprint_opportunities(
            profile=normalized.model_dump(),
            industry_pack=industry_pack,
            use_cases=scoped_use_cases,
        )
    ]
    solutions = build_recommended_solutions(profile=normalized.model_dump())
    operating_model = build_operating_model(profile=normalized.model_dump())
    recommended_agents = build_recommended_agents(
        profile=normalized.model_dump(),
        industry_pack=industry_pack,
    )
    architecture_layers = build_architecture_layers(
        profile=normalized.model_dump(),
        industry_pack=industry_pack,
    )
    governance_framework = build_governance_framework(
        industry_pack=industry_pack,
        priority_labels=normalized.top_priorities,
    )
    roadmap_phases = build_roadmap_phases(
        profile=normalized.model_dump(),
        readiness_score=readiness_score,
    )
    business_impact = estimate_business_impact(
        profile=normalized.model_dump(),
        readiness_score=readiness_score,
    )
    next_actions = build_next_actions(readiness_score)
    profile_summary = compose_profile_summary(
        profile=normalized.model_dump(),
        industry_pack=industry_pack,
        readiness_category=readiness_category,
    )
    handoff_summary = build_handoff_summary(
        profile=normalized.model_dump(),
        top_solution_names=[solution.name for solution in solutions],
    )
    confidence_score = min(
        0.95,
        0.72
        + (0.08 if not pack_warnings else 0.0)
        + (0.05 if normalized.existing_systems else 0.0)
        + (0.05 if normalized.data_readiness in {"Mostly integrated", "Fully integrated"} else 0.0),
    )
    blueprint = BlueprintOutput(
        id=blueprint_id,
        request_id=request_id,
        generated_at=datetime.now(timezone.utc),
        input_profile=normalized,
        profile_summary=profile_summary,
        readiness_score=readiness_score,
        readiness_category=readiness_category,
        readiness_breakdown=readiness_breakdown,
        top_opportunities=opportunities,
        recommended_solutions=solutions,
        operating_model=operating_model,
        recommended_agents=recommended_agents,
        architecture_layers=architecture_layers,
        governance_framework=governance_framework,
        roadmap_phases=roadmap_phases,
        business_impact=business_impact,
        next_actions=next_actions,
        confidence_score=confidence_score,
        assumptions=assumptions,
        warnings=pack_warnings,
        handoff_summary=handoff_summary,
    )
    tailored_summary, llm_warnings = compose_blueprint_narrative(
        blueprint=blueprint,
        profile=normalized,
    )
    validated_output = blueprint.model_copy(
        update={
            "profile_summary": tailored_summary,
            "warnings": blueprint.warnings + llm_warnings,
        }
    )
    return BlueprintOutput.model_validate(validated_output)


def initialize_state(profile: BlueprintProfile, request_id: str | None = None) -> BlueprintState:
    return BlueprintState(
        request_id=request_id,
        profile=profile,
        generated_at=datetime.now(timezone.utc),
    )
