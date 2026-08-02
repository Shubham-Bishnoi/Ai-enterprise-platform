"""End-to-end tests for the normalized lead-capture layer.

Every journey posts through the real API and then asserts committed rows in
`lead_submissions` and `excel_sync_outbox` — no success without an insert.
"""

from sqlalchemy import select, text

from app.db.session import get_session_factory
from app.models.contact import ContactRequest
from app.models.lead import Lead
from app.models.lead_capture import ExcelSyncOutbox, LeadSubmission

METADATA = {
    "source_page": "/contact",
    "utm_source": "linkedin",
    "utm_medium": "social",
    "utm_campaign": "launch",
    "referrer": "https://www.linkedin.com/",
    "consent_status": "privacy_policy_acknowledged",
    "privacy_policy_version": "v1",
    "marketing_consent": True,
}


def _contact_payload(**overrides):
    payload = {
        "name": "Contact User",
        "company": "GFF AI",
        "email": "Contact.User@Example.COM",
        "intent": "general",
        "message": "I want to discuss enterprise AI transformation.",
        "source": "contact_page",
        "metadata": dict(METADATA),
    }
    payload.update(overrides)
    return payload


def _rows(model):
    with get_session_factory()() as db:
        return list(db.scalars(select(model)))


def test_contact_submission_creates_submission_and_outbox(client):
    response = client.post("/api/v1/contact", json=_contact_payload())
    assert response.status_code == 200

    submissions = _rows(LeadSubmission)
    assert len(submissions) == 1
    submission = submissions[0]
    assert submission.source_type == "contact"
    assert submission.utm_source == "linkedin"
    assert submission.utm_campaign == "launch"
    assert submission.source_page == "/contact"
    assert submission.consent_status == "privacy_policy_acknowledged"
    assert submission.marketing_consent is True
    assert submission.contact_request_id

    outbox = _rows(ExcelSyncOutbox)
    assert len(outbox) == 1
    event = outbox[0]
    assert event.sheet_key == "sales_enquiries"
    assert event.status == "pending"
    assert event.event_id == submission.id
    assert event.payload["EnquiryType"] == "contact"
    # Emails are normalised (trimmed + lower-cased) for reporting.
    assert event.payload["Email"] == "contact.user@example.com"
    assert event.payload["UTMSource"] == "linkedin"
    assert event.payload["FollowUpStatus"] == "New"

    leads = _rows(Lead)
    assert leads[0].normalized_email == "contact.user@example.com"
    assert leads[0].consent_status == "privacy_policy_acknowledged"
    assert leads[0].marketing_consent is True


def test_workshop_and_proposal_intents_map_to_enquiry_types(client):
    client.post("/api/v1/contact", json=_contact_payload(intent="book_workshop", message="Workshop please."))
    client.post("/api/v1/contact", json=_contact_payload(intent="request_proposal", message="Proposal please."))

    submissions = {s.objective_summary: s.source_type for s in _rows(LeadSubmission)}
    assert submissions == {"Workshop please.": "workshop", "Proposal please.": "proposal"}
    sheets = {event.payload["EnquiryType"] for event in _rows(ExcelSyncOutbox)}
    assert sheets == {"workshop", "proposal"}


def test_consultation_booking_creates_submission(client):
    response = client.post(
        "/api/v1/consultation/book",
        json={
            "name": "Booker",
            "email": "booker@example.com",
            "company": "GFF AI",
            "consultation_type": "discovery_call",
            "preferred_date": "2026-09-01",
            "preferred_time": "10:00",
            "timezone": "Asia/Singapore",
            "notes": "Discuss enterprise memory.",
            "source": "contact_page",
            "metadata": dict(METADATA),
        },
    )
    assert response.status_code == 200

    submission = _rows(LeadSubmission)[0]
    assert submission.source_type == "consultation"
    assert submission.consultation_booking_id

    event = _rows(ExcelSyncOutbox)[0]
    assert event.sheet_key == "sales_enquiries"
    assert event.payload["PreferredDate"] == "2026-09-01"
    assert event.payload["Timezone"] == "Asia/Singapore"


def test_handoff_with_email_creates_human_handoff_submission(client):
    response = client.post(
        "/api/v1/handoff",
        json={
            "handoff_type": "human_expert",
            "email": "human@example.com",
            "name": "Chat Visitor",
            "company": None,
            "source": "talk_to_agent_chat",
            "recommended_specialist": None,
            "summary": "Visitor chatting with AI Strategy Agent asked for a human expert follow-up.",
            "context": dict(METADATA),
        },
    )
    assert response.status_code == 200

    submission = _rows(LeadSubmission)[0]
    assert submission.source_type == "human_handoff"
    assert submission.handoff_request_id
    event = _rows(ExcelSyncOutbox)[0]
    assert event.sheet_key == "sales_enquiries"
    assert event.payload["BusinessObjective"] == "human_expert"


def test_handoff_without_email_creates_no_submission(client):
    response = client.post(
        "/api/v1/handoff",
        json={
            "handoff_type": "human_expert",
            "email": None,
            "name": None,
            "company": None,
            "source": "talk_to_agent_chat",
            "recommended_specialist": None,
            "summary": "Anonymous visitor asked about pricing.",
            "context": {},
        },
    )
    assert response.status_code == 200
    assert _rows(LeadSubmission) == []
    assert _rows(ExcelSyncOutbox) == []


def test_blueprint_generate_creates_website_lead_submission(client):
    response = client.post(
        "/api/v1/blueprint/generate",
        json={
            "industry": "Insurance",
            "company_size": "Startup",
            "top_priorities": ["Cost Reduction", "Compliance"],
            "ai_journey_stage": "Just Starting",
            "biggest_challenge": "Data Quality",
            "email": "Blueprint.User@Company.com",
            "data_readiness": "Partially connected",
            "existing_systems": ["CRM", "ERP"],
            "leadership_commitment": "Exploring",
            "risk_appetite": "Balanced",
            "source": "homepage_blueprint",
            "chat_session_id": None,
            "metadata": dict(METADATA),
        },
    )
    assert response.status_code == 200

    submission = _rows(LeadSubmission)[0]
    assert submission.source_type == "blueprint"
    assert submission.blueprint_request_id
    assert submission.blueprint_result_id

    event = _rows(ExcelSyncOutbox)[0]
    assert event.sheet_key == "website_leads"
    assert event.payload["Source"] == "Blueprint"
    assert event.payload["Email"] == "blueprint.user@company.com"
    assert event.payload["BlueprintID"] == submission.blueprint_result_id
    assert "Cost Reduction" in event.payload["ObjectiveSummary"]


def test_double_submit_collapses_but_repeat_submission_kept(client):
    payload = _contact_payload()
    assert client.post("/api/v1/contact", json=payload).status_code == 200
    assert client.post("/api/v1/contact", json=payload).status_code == 200

    # The operational record is always kept per POST…
    assert len(_rows(ContactRequest)) == 2
    # …but the identical double-submit collapses to one submission/Excel row.
    assert len(_rows(LeadSubmission)) == 1
    assert len(_rows(ExcelSyncOutbox)) == 1

    # A repeat enquiry with different content from the same person is kept.
    assert client.post("/api/v1/contact", json=_contact_payload(message="Different question.")).status_code == 200
    assert len(_rows(LeadSubmission)) == 2
    assert len(_rows(Lead)) == 1  # still one person


def test_invalid_email_is_rejected_and_stores_nothing(client):
    response = client.post("/api/v1/contact", json=_contact_payload(email="not-an-email"))
    assert response.status_code >= 400
    assert _rows(LeadSubmission) == []
    assert _rows(ExcelSyncOutbox) == []
    assert _rows(Lead) == []


def test_missing_consent_metadata_still_saves_lead(client):
    response = client.post("/api/v1/contact", json=_contact_payload(metadata={}))
    assert response.status_code == 200
    submission = _rows(LeadSubmission)[0]
    assert submission.consent_status is None
    assert submission.marketing_consent is False


def test_reporting_views_return_expected_rows(client):
    client.post("/api/v1/contact", json=_contact_payload())
    client.post(
        "/api/v1/blueprint/generate",
        json={
            "industry": "Insurance",
            "company_size": "Startup",
            "top_priorities": ["Compliance"],
            "ai_journey_stage": "Just Starting",
            "biggest_challenge": "Data Quality",
            "email": "views@example.com",
            "source": "homepage_blueprint",
            "metadata": dict(METADATA),
        },
    )

    with get_session_factory()() as db:
        website = db.execute(text("SELECT * FROM reporting_website_leads")).mappings().all()
        sales = db.execute(text("SELECT * FROM reporting_sales_enquiries")).mappings().all()

    assert len(website) == 1
    assert website[0]["Email"] == "views@example.com"
    assert website[0]["Source"] == "Blueprint"
    assert len(sales) == 1
    assert sales[0]["Email"] == "contact.user@example.com"
    assert sales[0]["EnquiryType"] == "contact"
