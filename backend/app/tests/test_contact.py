from app.repositories.analytics import AnalyticsRepository


def test_contact_creates_lead_and_contact_request(client):
    response = client.post(
        "/api/v1/contact",
        json={
            "name": "Contact User",
            "company": "GFF AI",
            "email": "contact@example.com",
            "intent": "book_consultation",
            "message": "I want to discuss enterprise AI transformation.",
            "source": "contact_page",
            "metadata": {"page": "/contact"},
        },
    )

    assert response.status_code == 200
    payload = response.json()["data"]
    assert payload["contact_request_id"]
    assert payload["lead_id"]

    summary = client.get("/api/v1/analytics/summary")
    summary_data = summary.json()["data"]
    assert summary_data["total_leads"] == 1
    assert summary_data["total_contact_requests"] == 1


def test_contact_analytics_failure_does_not_crash_request(client, monkeypatch):
    original_create = AnalyticsRepository.create

    def broken_create(self, **kwargs):  # noqa: ANN001
        if kwargs["event_name"] == "contact_request_created":
            raise RuntimeError("analytics unavailable")
        return original_create(self, **kwargs)

    monkeypatch.setattr(AnalyticsRepository, "create", broken_create)

    response = client.post(
        "/api/v1/contact",
        json={
            "name": "Contact User",
            "company": "GFF AI",
            "email": "safe@example.com",
            "intent": "general",
            "message": "Need more information.",
            "source": "contact_page",
            "metadata": {},
        },
    )

    assert response.status_code == 200
    assert response.json()["success"] is True
