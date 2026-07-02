def test_consultation_booking_creates_record(client):
    response = client.post(
        "/api/v1/consultation/book",
        json={
            "name": "Consult User",
            "email": "consult@example.com",
            "company": "GFF AI",
            "consultation_type": "ai_blueprint_review",
            "preferred_date": "2026-07-15",
            "preferred_time": "10:00",
            "timezone": "Asia/Singapore",
            "notes": "Please review our blueprint.",
            "source": "blueprint_next_action",
            "metadata": {"origin": "blueprint"},
        },
    )

    assert response.status_code == 200
    payload = response.json()["data"]
    assert payload["booking_id"]
    assert payload["status"] == "requested"

    summary = client.get("/api/v1/analytics/summary")
    assert summary.json()["data"]["total_consultation_bookings"] == 1


def test_consultation_slots_placeholder(client):
    response = client.get("/api/v1/consultation/slots")

    assert response.status_code == 200
    assert response.json()["data"]["slots"] == []
    assert "configured later" in response.json()["data"]["message"]
