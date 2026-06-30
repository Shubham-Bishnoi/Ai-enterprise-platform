def test_list_agents_returns_all_seeded_agents(client):
    response = client.get("/api/v1/agents")

    assert response.status_code == 200
    payload = response.json()
    assert payload["success"] is True
    assert len(payload["data"]) == 5
    ids = {agent["id"] for agent in payload["data"]}
    assert ids == {"strategy", "architect", "governance", "industry", "training"}


def test_get_single_agent_returns_quick_actions(client):
    response = client.get("/api/v1/agents/governance")

    assert response.status_code == 200
    payload = response.json()
    assert payload["data"]["id"] == "governance"
    assert len(payload["data"]["quick_actions"]) == 6
