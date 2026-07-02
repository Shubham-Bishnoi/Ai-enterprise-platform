# Phase 2 API Contract

## Response Envelope

```json
{
  "success": true,
  "data": {},
  "error": null,
  "meta": {}
}
```

## Leads

### POST `/api/v1/leads`

```json
{
  "email": "user@company.com",
  "name": "Optional Name",
  "company": "Optional Company",
  "phone": "optional",
  "role": "optional",
  "industry": "optional",
  "company_size": "optional",
  "source": "homepage_blueprint",
  "metadata": {}
}
```

### GET `/api/v1/leads/{lead_id}`
- Returns the stored lead record.

## Contact

### POST `/api/v1/contact`

```json
{
  "name": "User Name",
  "company": "Company",
  "email": "user@company.com",
  "intent": "book_consultation",
  "message": "I want to discuss enterprise AI transformation",
  "source": "contact_page",
  "metadata": {}
}
```

## Consultation

### POST `/api/v1/consultation/book`

```json
{
  "name": "User Name",
  "email": "user@company.com",
  "company": "Company",
  "consultation_type": "ai_blueprint_review",
  "preferred_date": "2026-07-15",
  "preferred_time": "10:00",
  "timezone": "Asia/Singapore",
  "notes": "optional",
  "source": "blueprint_next_action",
  "metadata": {}
}
```

### GET `/api/v1/consultation/slots`

```json
{
  "success": true,
  "data": {
    "slots": [],
    "message": "Calendar integration will be configured later."
  },
  "error": null,
  "meta": null
}
```

## Handoff

### POST `/api/v1/handoff`

```json
{
  "handoff_type": "proposal",
  "email": "user@company.com",
  "name": "Optional Name",
  "company": "Optional Company",
  "chat_session_id": "optional",
  "blueprint_result_id": "optional",
  "source": "talk_to_agent",
  "recommended_specialist": "AI Architect Agent",
  "summary": "User wants AI architecture roadmap",
  "context": {}
}
```

## Analytics

### POST `/api/v1/analytics/events`

```json
{
  "event_name": "blueprint_generate_completed",
  "source": "homepage_blueprint",
  "page_path": "/",
  "component": "BlueprintGenerator",
  "session_id": "optional",
  "lead_id": "optional",
  "payload": {}
}
```

### GET `/api/v1/analytics/summary`

```json
{
  "success": true,
  "data": {
    "total_leads": 12,
    "total_contact_requests": 4,
    "total_consultation_bookings": 3,
    "total_handoff_requests": 5,
    "total_blueprint_generated_events": 8,
    "total_agent_message_events": 31
  },
  "error": null,
  "meta": null
}
```

## Error Examples

### Invalid Email

```json
{
  "detail": [
    {
      "type": "value_error",
      "loc": ["body", "email"],
      "msg": "Value error, email must be a valid email address.",
      "input": "not-an-email"
    }
  ]
}
```

### Missing Linked Resource

```json
{
  "success": false,
  "data": null,
  "error": {
    "code": "blueprint_not_found",
    "message": "Blueprint not found.",
    "details": null
  },
  "meta": null
}
```

### Internal Error

```json
{
  "success": false,
  "data": null,
  "error": {
    "code": "internal_error",
    "message": "An unexpected error occurred.",
    "details": {
      "reason": "..."
    }
  },
  "meta": null
}
```
