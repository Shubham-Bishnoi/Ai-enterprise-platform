# Phase 0: Talk to Agent Foundation

## Goal

Build the backend and AI foundation for Talk to Agent without changing the existing frontend UI.

## Delivered

- FastAPI backend scaffold
- SQLAlchemy models for agents, sessions, messages, analytics, and leads
- Agent seed data for all five specialists
- Structured Talk to Agent APIs
- LangGraph-ready discovery graph
- Deterministic mock AI mode
- Analytics event storage
- Tests and docs

## Discovery Behavior

Talk to Agent acts as the primary discovery and routing layer. It is expected to:

- identify industry
- identify role
- identify business objective
- identify AI maturity
- capture constraints
- route to the best specialist
- return structured recommendations
- suggest next actions

## States

- `welcome`
- `profiling`
- `clarifying`
- `routing`
- `recommendation_ready`
- `handoff_ready`
- `error`

## Backend Flow

1. Create session
2. Persist user message
3. Run discovery graph
4. Persist assistant message with structured payload
5. Update session profile, route, state, confidence, and recommendation payload
6. Store analytics events

## Mock Mode

With `ENABLE_AI_MOCK_MODE=true`, the system:

- routes deterministically from keywords
- extracts profile data heuristically
- returns structured recommendation JSON
- stores the same session and analytics data as real mode

## Future Frontend Integration

Phase 0 does not replace the existing frontend mocks yet. The next integration step is:

1. keep current UI components intact
2. replace `createMockSession()` with `POST /api/v1/agents/session`
3. replace `generateMockRecommendation()` with `POST /api/v1/agents/chat`
4. replace static quick action execution with `POST /api/v1/agents/quick-action`
5. send analytics from the frontend to `POST /api/v1/analytics/events`

## Phase 1 Ready

The current structure is intentionally modular so Blueprint generation can consume:

- existing `ChatSession`
- extracted profile data
- route selection
- recommendation payload
- handoff packet generation
