def test_leads_create_and_retrieve(client):
    response = client.post(
        "/api/v1/leads",
        json={
            "email": "lead@example.com",
            "name": "Lead User",
            "company": "GFF AI",
            "source": "homepage_blueprint",
            "metadata": {"channel": "blueprint"},
        },
    )

    assert response.status_code == 200
    payload = response.json()["data"]
    assert payload["lead_id"]
    assert payload["status"] == "new"

    retrieved = client.get(f"/api/v1/leads/{payload['lead_id']}")
    assert retrieved.status_code == 200
    assert retrieved.json()["data"]["email"] == "lead@example.com"


def test_leads_updates_existing_email_without_duplicate(client):
    first = client.post(
        "/api/v1/leads",
        json={
            "email": "same@example.com",
            "name": "First Name",
            "source": "homepage_blueprint",
            "metadata": {"phase": "one"},
        },
    )
    second = client.post(
        "/api/v1/leads",
        json={
            "email": "same@example.com",
            "company": "Updated Company",
            "source": "contact_page",
            "metadata": {"phase": "two"},
        },
    )

    assert first.status_code == 200
    assert second.status_code == 200
    assert first.json()["data"]["lead_id"] == second.json()["data"]["lead_id"]

    summary = client.get("/api/v1/analytics/summary")
    assert summary.status_code == 200
    assert summary.json()["data"]["total_leads"] == 1
