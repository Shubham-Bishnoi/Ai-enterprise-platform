VALID_BLUEPRINT_PAYLOAD = {
    "industry": "Insurance",
    "company_size": "Startup",
    "top_priorities": ["Cost Reduction", "Compliance"],
    "ai_journey_stage": "Just Starting",
    "biggest_challenge": "Data Quality",
    "email": "user@company.com",
    "data_readiness": "Partially connected",
    "existing_systems": ["CRM", "ERP"],
    "leadership_commitment": "Exploring",
    "risk_appetite": "Balanced",
    "source": "homepage_blueprint",
    "chat_session_id": None,
}


def test_blueprint_generate_persists_and_returns_schema(client):
    response = client.post("/api/v1/blueprint/generate", json=VALID_BLUEPRINT_PAYLOAD)

    assert response.status_code == 200
    payload = response.json()["data"]
    assert payload["id"]
    assert payload["request_id"]
    assert payload["readiness_score"] >= 0
    assert payload["readiness_category"]
    assert payload["profile_summary"]
    assert payload["top_opportunities"]
    assert payload["recommended_solutions"]
    assert payload["operating_model"]
    assert payload["recommended_agents"]
    assert payload["architecture_layers"]
    assert payload["governance_framework"]
    assert payload["roadmap_phases"]
    assert payload["business_impact"]
    assert payload["next_actions"]


def test_blueprint_generate_validates_required_fields(client):
    invalid_payload = dict(VALID_BLUEPRINT_PAYLOAD)
    invalid_payload.pop("industry")

    response = client.post("/api/v1/blueprint/generate", json=invalid_payload)

    assert response.status_code == 422


def test_blueprint_generate_rejects_invalid_email(client):
    invalid_payload = dict(VALID_BLUEPRINT_PAYLOAD)
    invalid_payload["email"] = "not-an-email"

    response = client.post("/api/v1/blueprint/generate", json=invalid_payload)

    assert response.status_code == 422


def test_blueprint_generate_rejects_empty_priorities(client):
    invalid_payload = dict(VALID_BLUEPRINT_PAYLOAD)
    invalid_payload["top_priorities"] = []

    response = client.post("/api/v1/blueprint/generate", json=invalid_payload)

    assert response.status_code == 422
