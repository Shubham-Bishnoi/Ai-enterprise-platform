from app.tests.test_blueprint_generate import VALID_BLUEPRINT_PAYLOAD


def test_handoff_endpoint_creates_request(client):
    response = client.post(
        "/api/v1/handoff",
        json={
            "handoff_type": "proposal",
            "email": "proposal@example.com",
            "name": "Proposal User",
            "company": "GFF AI",
            "source": "talk_to_agent",
            "recommended_specialist": "AI Architect Agent",
            "summary": "User wants an enterprise AI proposal.",
            "context": {"topic": "proposal"},
        },
    )

    assert response.status_code == 200
    payload = response.json()["data"]
    assert payload["handoff_id"]
    assert payload["status"] == "requested"

    summary = client.get("/api/v1/analytics/summary")
    assert summary.json()["data"]["total_handoff_requests"] == 1


def test_blueprint_handoff_reuses_shared_handoff_service(client):
    generated = client.post("/api/v1/blueprint/generate", json=VALID_BLUEPRINT_PAYLOAD)
    blueprint_id = generated.json()["data"]["id"]

    response = client.post(f"/api/v1/blueprint/{blueprint_id}/handoff")

    assert response.status_code == 200
    assert response.json()["data"]["blueprint_id"] == blueprint_id

    summary = client.get("/api/v1/analytics/summary")
    assert summary.json()["data"]["total_handoff_requests"] == 1
