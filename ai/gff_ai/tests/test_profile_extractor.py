from gff_ai.engines.profile_extractor import extract_profile


def test_profile_extractor_detects_industry_and_constraints():
    result = extract_profile(
        "I am a CTO in banking and want to automate compliance with security and budget constraints."
    )

    assert result.profile.industry == "banking"
    assert result.profile.role == "CTO"
    assert "security requirements" in result.profile.constraints
    assert "budget" in result.profile.constraints
