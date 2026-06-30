def create_session(client, selected_agent_id="strategy"):
    response = client.post(
        "/api/v1/agents/session",
        json={
            "selected_agent_id": selected_agent_id,
            "source_surface": "homepage_inline_chat",
        },
    )
    assert response.status_code == 200
    return response.json()["data"]["session_id"]


def test_mock_chat_response_schema(client):
    session_id = create_session(client, "strategy")
    response = client.post(
        "/api/v1/agents/chat",
        json={
            "session_id": session_id,
            "message": "Help me define a 90-day AI pilot for manufacturing.",
            "selected_agent_id": "strategy",
            "source_surface": "homepage_inline_chat",
        },
    )

    assert response.status_code == 200
    payload = response.json()["data"]
    assert payload["session_id"] == session_id
    assert isinstance(payload["recommended_paths"], list)
    assert isinstance(payload["recommended_solutions"], list)
    assert isinstance(payload["next_actions"], list)
    assert 0 <= payload["confidence_score"] <= 1


def test_quick_action_handling(client):
    session_id = create_session(client, "governance")
    response = client.post(
        "/api/v1/agents/quick-action",
        json={
            "session_id": session_id,
            "quick_action_id": "define-risk-controls",
            "selected_agent_id": "governance",
        },
    )

    assert response.status_code == 200
    payload = response.json()["data"]
    assert payload["session_id"] == session_id
    assert payload["recommended_paths"]


def test_low_confidence_fallback(client):
    session_id = create_session(client)
    response = client.post(
        "/api/v1/agents/chat",
        json={
            "session_id": session_id,
            "message": "Can you help us think through this?",
            "source_surface": "homepage_inline_chat",
        },
    )

    assert response.status_code == 200
    payload = response.json()["data"]
    assert payload["state"] == "clarifying"
    assert len(payload["suggested_questions"]) >= 1
    assert len(payload["recommended_paths"]) >= 2


def test_analytics_event_creation(client):
    session_id = create_session(client, "training")
    response = client.post(
        "/api/v1/analytics/events",
        json={
            "session_id": session_id,
            "event_name": "talk_to_agent_error",
            "source": "backend_test",
            "payload": {"reason": "synthetic"},
        },
    )

    assert response.status_code == 200
    payload = response.json()["data"]
    assert payload["event_name"] == "talk_to_agent_error"
    assert payload["session_id"] == session_id
