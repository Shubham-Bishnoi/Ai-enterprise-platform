# Frontend Talk to Agent API Contract

This document preserves the current frontend UI while defining the Phase 0 backend contract.

## Session Creation

`POST /api/v1/agents/session`

Request:

```json
{
  "selected_agent_id": "strategy",
  "initial_prompt": "optional",
  "quick_action_id": "optional",
  "source_surface": "homepage_inline_chat",
  "page_context": "optional"
}
```

Response:

```json
{
  "success": true,
  "data": {
    "session_id": "uuid",
    "state": "welcome",
    "selected_agent": null,
    "messages": [],
    "quick_actions": []
  },
  "error": null
}
```

## Send Message

`POST /api/v1/agents/chat`

Request:

```json
{
  "session_id": "uuid",
  "message": "I want to build AI agents for banking compliance",
  "selected_agent_id": "governance",
  "source_surface": "homepage_inline_chat"
}
```

Response shape:

```json
{
  "success": true,
  "data": {
    "session_id": "uuid",
    "state": "recommendation_ready",
    "assistant_message": "string",
    "extracted_profile": {
      "industry": "banking",
      "role": null,
      "objective": "build AI agents for banking compliance",
      "geography": null,
      "ai_maturity": null,
      "constraints": []
    },
    "confidence_score": 0.82,
    "recommended_paths": [],
    "recommended_solutions": [],
    "suggested_questions": [],
    "next_actions": []
  },
  "error": null
}
```

## Quick Action

`POST /api/v1/agents/quick-action`

```json
{
  "session_id": "uuid",
  "quick_action_id": "define-risk-controls",
  "selected_agent_id": "governance"
}
```

## Session Load

`GET /api/v1/agents/session/{session_id}`

Returns the stored session, messages, profile snapshot, recommendation payload, and confidence score.

## Handoff

`POST /api/v1/agents/handoff`

Prepares a structured handoff packet for a workshop, proposal, or human specialist.

## Analytics

`POST /api/v1/analytics/events`

Recommended frontend events:

- `talk_to_agent_session_created`
- `talk_to_agent_message_sent`
- `talk_to_agent_quick_action_clicked`
- `talk_to_agent_profile_extracted`
- `talk_to_agent_route_selected`
- `talk_to_agent_recommendation_shown`
- `talk_to_agent_handoff_requested`
- `talk_to_agent_error`
