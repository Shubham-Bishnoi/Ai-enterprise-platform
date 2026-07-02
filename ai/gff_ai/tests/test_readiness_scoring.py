from gff_ai.engines.readiness_scoring import compute_readiness_score
from gff_ai.schemas.profile import BlueprintProfile


def test_readiness_formula_matches_expected_weighting():
    profile = BlueprintProfile(
        industry="Insurance",
        company_size="Startup",
        top_priorities=["Cost Reduction", "Compliance"],
        ai_journey_stage="Just Starting",
        biggest_challenge="Data Quality",
        email="user@company.com",
        data_readiness="Partially connected",
        existing_systems=["CRM"],
        leadership_commitment="Exploring",
        risk_appetite="Balanced",
        source="homepage_blueprint",
    )

    score, category, breakdown = compute_readiness_score(profile)

    assert breakdown.ai_maturity == 20
    assert breakdown.business_need == 30
    assert breakdown.data_readiness == 50
    assert breakdown.process_complexity == 20
    assert breakdown.transformation_readiness == 50
    assert score == 33
    assert category == "AI Explorer"
