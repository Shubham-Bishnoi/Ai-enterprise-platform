import uuid


def _event(name: str = "cta_clicked", **overrides) -> dict:
    body = {
        "event_id": str(uuid.uuid4()),
        "event_name": name,
        "source": "hero",
        "page_path": "/",
        "component": "Hero",
        "payload": {"cta": "generate_blueprint"},
    }
    body.update(overrides)
    return body


def test_analytics_event_is_stored(client):
    response = client.post("/api/v1/analytics/events", json=_event())

    assert response.status_code == 200
    data = response.json()["data"]
    assert data["stored"] is True
    assert data["duplicate"] is False
    assert data["id"]


def test_analytics_event_rejects_unknown_event_name(client):
    response = client.post("/api/v1/analytics/events", json=_event(name="totally_made_up_event"))

    assert response.status_code == 422
    assert response.json()["error"]["code"] == "unknown_event"


def test_analytics_summary_returns_basic_counts(client):
    client.post("/api/v1/analytics/events", json=_event("blueprint_generate_completed"))
    client.post("/api/v1/analytics/events", json=_event("talk_to_agent_message_sent"))

    response = client.get("/api/v1/analytics/summary")

    assert response.status_code == 200
    data = response.json()["data"]
    assert data["total_blueprint_generated_events"] == 1
    assert data["total_agent_message_events"] == 1
