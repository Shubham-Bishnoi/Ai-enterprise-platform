def test_blueprint_options_returns_seeded_groups(client):
    response = client.get("/api/v1/blueprint/options")

    assert response.status_code == 200
    payload = response.json()
    assert payload["success"] is True
    assert payload["data"]["industries"]
    assert payload["data"]["company_sizes"]
    assert payload["data"]["top_priorities"]
    assert payload["data"]["ai_journey_stages"]
    assert payload["data"]["biggest_challenges"]
    assert payload["data"]["advanced_options"]["data_readiness"]
    assert payload["meta"]["source"] == "seeded-taxonomy"
