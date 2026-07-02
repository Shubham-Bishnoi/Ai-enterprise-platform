AI_MATURITY_SCORES = {
    "no ai": 10,
    "just starting": 20,
    "exploring ai": 30,
    "exploring": 30,
    "running pilots": 60,
    "piloting": 60,
    "scaling ai": 85,
    "scaling": 85,
    "ai-driven enterprise": 100,
    "ai-native": 100,
    "transforming": 100,
}

BUSINESS_NEED_SCORES = {
    "cost reduction": 20,
    "reduce costs": 20,
    "productivity": 20,
    "improve productivity": 20,
    "customer experience": 15,
    "improve customer experience": 15,
    "revenue growth": 15,
    "increase revenue": 15,
    "compliance": 10,
    "strengthen compliance": 10,
    "ai transformation": 20,
    "automate processes": 15,
    "faster decision making": 15,
    "employee experience": 10,
}

DATA_READINESS_SCORES = {
    "highly fragmented": 20,
    "partially connected": 50,
    "mostly integrated": 75,
    "fully integrated": 100,
}

PROCESS_COMPLEXITY_SCORES = {
    "startup": 20,
    "<100": 20,
    "smb": 50,
    "100-1000": 50,
    "100–1000": 50,
    "enterprise": 80,
    "1000-10000": 80,
    "1000–10000": 80,
    "large enterprise": 100,
    "10000+": 100,
}

TRANSFORMATION_READINESS_SCORES = {
    "not discussed": 20,
    "exploring": 50,
    "budget approved": 80,
    "executive mandate": 100,
}

SCORE_CATEGORY_RANGES = (
    (25, "AI Beginner"),
    (50, "AI Explorer"),
    (70, "AI Adopter"),
    (85, "AI Transformer"),
    (100, "AI-Native Leader"),
)


def normalize_key(value: str | None) -> str:
    return (value or "").strip().lower()


def score_ai_maturity(journey_stage: str) -> int:
    return AI_MATURITY_SCORES.get(normalize_key(journey_stage), 20)


def score_business_need(top_priorities: list[str]) -> int:
    total = sum(BUSINESS_NEED_SCORES.get(normalize_key(priority), 0) for priority in top_priorities)
    return min(total, 100)


def infer_data_readiness(ai_maturity_score: int) -> int:
    if ai_maturity_score >= 85:
        return 75
    if ai_maturity_score >= 60:
        return 50
    return 20


def score_data_readiness(data_readiness: str | None, ai_maturity_score: int) -> int:
    if data_readiness:
        return DATA_READINESS_SCORES.get(normalize_key(data_readiness), infer_data_readiness(ai_maturity_score))
    return infer_data_readiness(ai_maturity_score)


def score_process_complexity(company_size: str) -> int:
    return PROCESS_COMPLEXITY_SCORES.get(normalize_key(company_size), 50)


def infer_transformation_readiness(journey_stage: str) -> int:
    key = normalize_key(journey_stage)
    if key in {"scaling ai", "scaling", "ai-driven enterprise", "ai-native", "transforming"}:
        return 80
    if key in {"running pilots", "piloting"}:
        return 50
    return 20


def score_transformation_readiness(leadership_commitment: str | None, journey_stage: str) -> int:
    if leadership_commitment:
        return TRANSFORMATION_READINESS_SCORES.get(
            normalize_key(leadership_commitment),
            infer_transformation_readiness(journey_stage),
        )
    return infer_transformation_readiness(journey_stage)


def score_category(score: int) -> str:
    for ceiling, label in SCORE_CATEGORY_RANGES:
        if score <= ceiling:
            return label
    return "AI-Native Leader"
