from gff_ai.engines.blueprint_engine import generate_blueprint
from gff_ai.schemas.profile import BlueprintProfile

INDUSTRY_PACKS = [
    {
        "slug": "insurance",
        "name": "Insurance",
        "description": "Insurance pack",
        "common_challenges": ["claims delays"],
        "recommended_use_cases": ["Claims Triage Agent"],
        "architecture_hints": ["claims integration"],
        "governance_priorities": ["traceability"],
        "recommended_agents": ["Claims Agent", "Governance Agent"],
        "business_outcomes": ["faster claims"],
        "roadmap_bias": {},
    },
    {
        "slug": "generic-enterprise",
        "name": "Generic Enterprise",
        "description": "Generic pack",
        "common_challenges": ["manual processes"],
        "recommended_use_cases": ["Knowledge Search Copilot"],
        "architecture_hints": ["data layer"],
        "governance_priorities": ["trust"],
        "recommended_agents": ["Strategy Agent", "Governance Agent"],
        "business_outcomes": ["better productivity"],
        "roadmap_bias": {},
    },
]

USE_CASES = [
    {
        "slug": "claims-triage-agent",
        "title": "Claims Triage Agent",
        "description": "Automate first-pass claims intake.",
        "industry_slug": "insurance",
        "capability_slug": "claims",
        "impact_level": "High",
        "complexity": "Medium",
        "time_to_value": "30-60 days",
        "recommended_agent": "Claims Agent",
        "tags": ["claims"],
        "status": "active",
    }
]


def _profile(industry: str = "Insurance") -> BlueprintProfile:
    return BlueprintProfile(
        industry=industry,
        company_size="Startup",
        top_priorities=["Cost Reduction", "Compliance"],
        ai_journey_stage="Just Starting",
        biggest_challenge="Data Quality",
        email="user@company.com",
        data_readiness="Partially connected",
        existing_systems=["CRM", "ERP"],
        leadership_commitment="Exploring",
        risk_appetite="Balanced",
        source="homepage_blueprint",
    )


def test_blueprint_engine_mock_mode_returns_complete_schema():
    result = generate_blueprint(
        profile=_profile(),
        industry_packs=INDUSTRY_PACKS,
        use_cases=USE_CASES,
        request_id="req_1",
        blueprint_id="bp_1",
    )

    assert result.id == "bp_1"
    assert result.request_id == "req_1"
    assert result.profile_summary
    assert result.top_opportunities
    assert result.recommended_solutions
    assert result.governance_framework
    assert result.roadmap_phases
    assert result.next_actions


def test_blueprint_engine_unknown_industry_falls_back_to_generic():
    result = generate_blueprint(
        profile=_profile(industry="Unknown Sector"),
        industry_packs=INDUSTRY_PACKS,
        use_cases=USE_CASES,
        request_id="req_2",
        blueprint_id="bp_2",
    )

    assert any("Generic Enterprise" in warning for warning in result.warnings)
