from app.db.session import get_session_factory
from app.repositories.analytics import AnalyticsRepository

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


def test_blueprint_retrieve_and_unknown_industry_fallback(client):
    payload = dict(VALID_BLUEPRINT_PAYLOAD)
    payload["industry"] = "Unknown Future Sector"

    generate_response = client.post("/api/v1/blueprint/generate", json=payload)
    assert generate_response.status_code == 200
    blueprint = generate_response.json()["data"]

    retrieve_response = client.get(f"/api/v1/blueprint/{blueprint['id']}")
    assert retrieve_response.status_code == 200
    retrieved = retrieve_response.json()["data"]

    assert retrieved["id"] == blueprint["id"]
    assert retrieved["request_id"] == blueprint["request_id"]
    assert any("Generic Enterprise" in warning for warning in retrieved["warnings"])


def test_blueprint_regenerate_export_email_and_handoff_endpoints_exist(client):
    generate_response = client.post("/api/v1/blueprint/generate", json=VALID_BLUEPRINT_PAYLOAD)
    blueprint_id = generate_response.json()["data"]["id"]

    regenerate_response = client.post(
        f"/api/v1/blueprint/{blueprint_id}/regenerate",
        json={"overrides": {"company_size": "Enterprise"}},
    )
    export_response = client.post(f"/api/v1/blueprint/{blueprint_id}/export")
    email_response = client.post(f"/api/v1/blueprint/{blueprint_id}/email")
    handoff_response = client.post(f"/api/v1/blueprint/{blueprint_id}/handoff")

    assert regenerate_response.status_code == 200
    assert export_response.status_code == 200
    assert email_response.status_code == 200
    assert handoff_response.status_code == 200
    assert regenerate_response.json()["data"]["readiness_score"] >= 0
    assert export_response.json()["data"]["action"] == "export"
    assert email_response.json()["data"]["action"] == "email"
    assert handoff_response.json()["data"]["blueprint_id"] == blueprint_id
    assert "workshop_type" in handoff_response.json()["data"]["handoff_summary"]


def test_blueprint_analytics_events_are_captured(client):
    options_response = client.get("/api/v1/blueprint/options")
    assert options_response.status_code == 200

    generate_response = client.post("/api/v1/blueprint/generate", json=VALID_BLUEPRINT_PAYLOAD)
    assert generate_response.status_code == 200
    blueprint_id = generate_response.json()["data"]["id"]

    assert client.get(f"/api/v1/blueprint/{blueprint_id}").status_code == 200
    assert client.post(f"/api/v1/blueprint/{blueprint_id}/regenerate", json={"overrides": {"company_size": "Enterprise"}}).status_code == 200
    assert client.post(f"/api/v1/blueprint/{blueprint_id}/export").status_code == 200
    assert client.post(f"/api/v1/blueprint/{blueprint_id}/email").status_code == 200
    assert client.post(f"/api/v1/blueprint/{blueprint_id}/handoff").status_code == 200

    with get_session_factory()() as db:
        event_names = [event.event_name for event in AnalyticsRepository(db).list_events()]

    for expected in [
        "blueprint_options_loaded",
        "blueprint_generate_started",
        "blueprint_generate_completed",
        "blueprint_retrieved",
        "blueprint_regenerate_requested",
        "blueprint_export_requested",
        "blueprint_email_requested",
        "blueprint_handoff_requested",
    ]:
        assert expected in event_names


def test_blueprint_not_found_returns_standard_error_envelope(client):
    response = client.get("/api/v1/blueprint/does-not-exist")

    assert response.status_code == 404
    payload = response.json()
    assert payload["success"] is False
    assert payload["data"] is None
    assert payload["error"]["code"] == "blueprint_not_found"
    assert payload["meta"] is None
