from gff_ai.engines.readiness_scoring import compute_readiness_score
from gff_ai.schemas.profile import BlueprintProfile


def _profile(**overrides):
    payload = {
        "industry": "Insurance",
        "company_size": "Startup",
        "top_priorities": ["Cost Reduction", "Compliance"],
        "ai_journey_stage": "Just Starting",
        "biggest_challenge": "Data Quality",
        "email": "user@company.com",
        "data_readiness": "Partially connected",
        "existing_systems": ["CRM"],
        "leadership_commitment": "Exploring",
        "risk_appetite": "Balanced",
        "source": "homepage_blueprint",
    }
    payload.update(overrides)
    return BlueprintProfile(**payload)


def test_readiness_scoring_is_deterministic():
    score_one = compute_readiness_score(_profile())
    score_two = compute_readiness_score(_profile())

    assert score_one == score_two


def test_readiness_score_category_mapping():
    low_score, low_category, _ = compute_readiness_score(_profile(ai_journey_stage="No AI", leadership_commitment="Not Discussed", data_readiness="Highly fragmented", top_priorities=["Compliance"]))
    high_score, high_category, _ = compute_readiness_score(
        _profile(
            company_size="10000+",
            ai_journey_stage="AI-Native",
            leadership_commitment="Executive Mandate",
            data_readiness="Fully integrated",
            top_priorities=["AI Transformation", "Cost Reduction", "Productivity"],
        )
    )

    assert low_score <= 25
    assert low_category == "AI Beginner"
    assert high_score >= 86
    assert high_category == "AI-Native Leader"
