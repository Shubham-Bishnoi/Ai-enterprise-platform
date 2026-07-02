# Blueprint API Contract

## Envelope

All Blueprint endpoints return the Phase 0-style envelope:

```json
{
  "success": true,
  "data": {},
  "error": null,
  "meta": {}
}
```

## GET `/api/v1/blueprint/options`

Returns seeded form options for:

- `industries`
- `company_sizes`
- `top_priorities`
- `ai_journey_stages`
- `biggest_challenges`
- `advanced_options`

Example response:

```json
{
  "success": true,
  "data": {
    "industries": [{ "label": "Insurance", "value": "Insurance", "description": null, "metadata": null }],
    "company_sizes": [{ "label": "Startup", "value": "Startup", "description": null, "metadata": null }],
    "top_priorities": [{ "label": "Cost Reduction", "value": "Cost Reduction", "description": null, "metadata": null }],
    "ai_journey_stages": [{ "label": "Just Starting", "value": "Just Starting", "description": null, "metadata": null }],
    "biggest_challenges": [{ "label": "Data Quality", "value": "Data Quality", "description": null, "metadata": null }],
    "advanced_options": {
      "data_readiness": [{ "label": "Partially connected", "value": "Partially connected", "description": null, "metadata": null }],
      "existing_systems": [{ "label": "CRM", "value": "CRM", "description": null, "metadata": null }],
      "leadership_commitment": [{ "label": "Exploring", "value": "Exploring", "description": null, "metadata": null }],
      "risk_appetite": [{ "label": "Balanced", "value": "Balanced", "description": null, "metadata": null }]
    }
  },
  "error": null,
  "meta": { "source": "seeded-taxonomy" }
}
```

## POST `/api/v1/blueprint/generate`

Example request:

```json
{
  "industry": "Insurance",
  "company_size": "Startup",
  "top_priorities": ["Cost Reduction", "Compliance"],
  "ai_journey_stage": "Just Starting",
  "biggest_challenge": "Data Quality",
  "email": "user@company.com",
  "data_readiness": "Partially connected",
  "existing_systems": ["CRM", "ERP"],
  "leadership_commitment": "Exploring",
  "risk_appetite": "Balanced",
  "source": "homepage_blueprint",
  "chat_session_id": null
}
```

Validation rules:

- `industry`, `company_size`, `top_priorities`, `ai_journey_stage`, `biggest_challenge`, `email` are required
- `email` must match a valid email shape
- `top_priorities` must not be empty
- `top_priorities` max length is `3`
- unknown industries fall back to `Generic Enterprise` and add a warning

Example success response:

```json
{
  "success": true,
  "data": {
    "id": "blueprint_result_id",
    "request_id": "blueprint_request_id",
    "generated_at": "2026-07-01T00:00:00Z",
    "input_profile": {
      "industry": "Insurance",
      "company_size": "Startup",
      "top_priorities": ["Cost Reduction", "Compliance"],
      "ai_journey_stage": "Just Starting",
      "biggest_challenge": "Data Quality",
      "email": "user@company.com",
      "data_readiness": "Partially connected",
      "existing_systems": ["CRM", "ERP"],
      "leadership_commitment": "Exploring",
      "risk_appetite": "Balanced",
      "source": "homepage_blueprint",
      "chat_session_id": null,
      "lead_id": "lead_id"
    },
    "profile_summary": "Deterministic blueprint summary...",
    "readiness_score": 33,
    "readiness_category": "AI Explorer",
    "readiness_breakdown": {
      "ai_maturity": 20,
      "business_need": 30,
      "data_readiness": 50,
      "process_complexity": 20,
      "transformation_readiness": 50,
      "weighted_score": 33
    },
    "top_opportunities": [],
    "recommended_solutions": [],
    "operating_model": [],
    "recommended_agents": [],
    "architecture_layers": [],
    "governance_framework": [],
    "roadmap_phases": [],
    "business_impact": [],
    "next_actions": [],
    "confidence_score": 0.85,
    "assumptions": [],
    "warnings": [],
    "handoff_summary": {
      "workshop_type": "Blueprint Validation Workshop",
      "executive_summary": "Prioritize...",
      "recommended_scope": [],
      "suggested_attendees": []
    },
    "created_at": "2026-07-01T00:00:00Z",
    "version": "v1",
    "ai_model": "gpt-4o-mini",
    "provider": "mock"
  },
  "error": null,
  "meta": { "version": "v1" }
}
```

## GET `/api/v1/blueprint/{blueprint_id}`

Returns the saved blueprint result by `blueprint_id`.

## POST `/api/v1/blueprint/{blueprint_id}/regenerate`

Request shape:

```json
{
  "overrides": {
    "company_size": "Enterprise"
  }
}
```

Returns a new result generated from the same stored request with overrides merged in.

## POST `/api/v1/blueprint/{blueprint_id}/export`

Placeholder response:

```json
{
  "success": true,
  "data": {
    "blueprint_id": "blueprint_result_id",
    "action": "export",
    "status": "placeholder",
    "message": "PDF export is reserved for Phase 1.5 frontend integration."
  },
  "error": null,
  "meta": null
}
```

## POST `/api/v1/blueprint/{blueprint_id}/email`

Placeholder response with the same action envelope pattern.

## POST `/api/v1/blueprint/{blueprint_id}/handoff`

Returns:

- `blueprint_id`
- `handoff_summary`

## Analytics Notes

The backend records Blueprint analytics events for:

- options load
- generate start
- generate complete
- generate fail
- retrieve
- regenerate
- export request
- email request
- handoff request

## Error Examples

Validation error:

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

Application error:

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
