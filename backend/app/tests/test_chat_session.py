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


def test_create_session_and_load_it(client):
    session_id = create_session(client, "strategy")

    load_response = client.get(f"/api/v1/agents/session/{session_id}")
    assert load_response.status_code == 200
    payload = load_response.json()["data"]
    assert payload["session_id"] == session_id
    assert payload["state"] == "welcome"
    assert payload["messages"] == []


def test_chat_message_persistence(client):
    session_id = create_session(client, "governance")
    response = client.post(
        "/api/v1/agents/chat",
        json={
            "session_id": session_id,
            "message": "I want to build AI agents for banking compliance with strict audit controls.",
            "selected_agent_id": "governance",
            "source_surface": "homepage_inline_chat",
        },
    )

    assert response.status_code == 200
    payload = response.json()["data"]
    assert payload["state"] in {"recommendation_ready", "clarifying"}
    assert payload["extracted_profile"]["industry"] == "banking"
    assert payload["assistant_message"]

    load_response = client.get(f"/api/v1/agents/session/{session_id}")
    messages = load_response.json()["data"]["messages"]
    assert len(messages) == 2
    assert messages[0]["role"] == "user"
    assert messages[1]["role"] == "assistant"
