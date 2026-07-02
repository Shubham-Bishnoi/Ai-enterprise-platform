from gff_ai.schemas.blueprint import ReadinessBreakdown
from gff_ai.schemas.profile import BlueprintProfile
from gff_ai.tools.scoring_tools import (
    score_ai_maturity,
    score_business_need,
    score_category,
    score_data_readiness,
    score_process_complexity,
    score_transformation_readiness,
)


def compute_readiness_score(profile: BlueprintProfile) -> tuple[int, str, ReadinessBreakdown]:
    ai_maturity = score_ai_maturity(profile.ai_journey_stage)
    business_need = score_business_need(profile.top_priorities)
    data_readiness = score_data_readiness(profile.data_readiness, ai_maturity)
    process_complexity = score_process_complexity(profile.company_size)
    transformation_readiness = score_transformation_readiness(
        profile.leadership_commitment,
        profile.ai_journey_stage,
    )

    weighted = round(
        (0.20 * ai_maturity)
        + (0.25 * business_need)
        + (0.20 * data_readiness)
        + (0.20 * process_complexity)
        + (0.15 * transformation_readiness)
    )
    breakdown = ReadinessBreakdown(
        ai_maturity=ai_maturity,
        business_need=business_need,
        data_readiness=data_readiness,
        process_complexity=process_complexity,
        transformation_readiness=transformation_readiness,
        weighted_score=weighted,
    )
    return weighted, score_category(weighted), breakdown
