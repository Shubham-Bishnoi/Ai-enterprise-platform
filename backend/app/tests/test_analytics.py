def test_analytics_event_is_stored(client):
    response = client.post(
        "/api/v1/analytics/events",
        json={
            "event_name": "hero_generate_blueprint_clicked",
            "source": "hero",
            "page_path": "/",
            "component": "Hero",
            "payload": {"cta": "generate_blueprint"},
        },
    )

    assert response.status_code == 200
    payload = response.json()["data"]
    assert payload["event_name"] == "hero_generate_blueprint_clicked"
    assert payload["page_path"] == "/"
    assert payload["component"] == "Hero"
    assert payload["ip_hash"]


def test_analytics_summary_returns_basic_counts(client):
    client.post(
        "/api/v1/analytics/events",
        json={
            "event_name": "blueprint_generate_completed",
            "source": "homepage_blueprint",
            "payload": {},
        },
    )
    client.post(
        "/api/v1/analytics/events",
        json={
            "event_name": "talk_to_agent_message_sent",
            "source": "homepage_inline_chat",
            "payload": {},
        },
    )

    response = client.get("/api/v1/analytics/summary")

    assert response.status_code == 200
    data = response.json()["data"]
    assert data["total_blueprint_generated_events"] == 1
    assert data["total_agent_message_events"] == 1
