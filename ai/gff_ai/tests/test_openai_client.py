import pytest

from gff_ai.llm.openai_client import OpenAIClient
from gff_ai.schemas.profile import ExtractedProfile


def test_parse_payload_accepts_provider_message_shape():
    client = OpenAIClient(api_key="test-key", model="test-model")

    payload = client._parse_payload('{"message":"Structured provider reply","suggested_questions":["What is your AI maturity?"]}')

    assert payload.specialist_response == "Structured provider reply"
    assert payload.reasoning_summary == "Provider returned a compatible message payload."
    assert payload.suggested_questions == ["What is your AI maturity?"]


def test_parse_payload_accepts_plain_text_fallback():
    client = OpenAIClient(api_key="test-key", model="test-model")

    payload = client._parse_payload("Plain text provider reply")

    assert payload.specialist_response == "Plain text provider reply"


def test_parse_payload_rejects_echoed_request_payload():
    client = OpenAIClient(api_key="test-key", model="test-model")

    with pytest.raises(ValueError):
        client._parse_payload(
            '{"selected_route":"strategy","latest_user_message":"Need roadmap","profile":{"industry":"banking"}}'
        )


def test_fallback_response_handles_low_confidence():
    client = OpenAIClient(api_key="test-key", model="test-model")

    text = client._fallback_response(
        route="strategy",
        profile=ExtractedProfile(constraints=["compliance"]),
        confidence_score=0.64,
    )

    assert "clarify" in text.lower()
