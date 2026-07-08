def test_health_endpoint(client):
    response = client.get("/api/v1/health")

    assert response.status_code == 200
    payload = response.json()
    assert payload["success"] is True
    assert payload["error"] is None
    assert payload["data"]["status"] == "ok"
    assert payload["data"]["mock_ai_mode"] is True
