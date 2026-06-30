from gff_ai.schemas.profile import ExtractedProfile, ProfileExtractionResult

INDUSTRIES = {
    "banking": "banking",
    "financial": "banking",
    "manufacturing": "manufacturing",
    "education": "education",
    "university": "education",
    "healthcare": "healthcare",
    "retail": "retail",
}

ROLES = {
    "cto": "CTO",
    "cio": "CIO",
    "chief data officer": "Chief Data Officer",
    "head of ai": "Head of AI",
    "compliance officer": "Compliance Officer",
}

MATURITY = {
    "starting": "early",
    "beginning": "early",
    "pilot": "pilot",
    "scaling": "scaling",
    "mature": "advanced",
}

CONSTRAINTS = {
    "budget": "budget",
    "regulation": "regulatory constraints",
    "compliance": "compliance requirements",
    "security": "security requirements",
    "timeline": "tight timeline",
    "legacy": "legacy systems",
}


def extract_profile(message: str) -> ProfileExtractionResult:
    lower_message = message.lower()
    profile = ExtractedProfile()

    for keyword, industry in INDUSTRIES.items():
        if keyword in lower_message:
            profile.industry = industry
            break

    for keyword, role in ROLES.items():
        if keyword in lower_message:
            profile.role = role
            break

    for keyword, maturity in MATURITY.items():
        if keyword in lower_message:
            profile.ai_maturity = maturity
            break

    for marker in ("want to", "need to", "help me"):
        if marker in lower_message:
            start = lower_message.index(marker) + len(marker)
            profile.objective = message[start:].strip().rstrip(".")
            break

    for keyword, label in CONSTRAINTS.items():
        if keyword in lower_message and label not in profile.constraints:
            profile.constraints.append(label)

    missing_fields = [
        field_name
        for field_name, value in profile.model_dump().items()
        if field_name != "constraints" and value is None
    ]
    return ProfileExtractionResult(profile=profile, missing_fields=missing_fields)
