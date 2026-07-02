# Frontend Blueprint Integration Plan

## Current State

The homepage Blueprint UI remains unchanged in Phase 1.

Still mock-driven today:

- form submission flow
- `generateMockBlueprint`
- local result shaping in the frontend
- placeholder export/email/handoff actions

Phase 1 intentionally only delivers the backend and AI contract.

## Goal For Phase 1.5

Replace the current mock generation path with real backend API calls while preserving the existing UI layout, tabs, and styling.

## Integration Steps

1. Add a new frontend API client file such as `src/lib/api/blueprintApi.ts`.
2. Implement methods for:
   - `getBlueprintOptions()`
   - `generateBlueprint(payload)`
   - `getBlueprint(blueprintId)`
   - `regenerateBlueprint(blueprintId, overrides)`
   - `exportBlueprint(blueprintId)`
   - `emailBlueprint(blueprintId)`
   - `handoffBlueprint(blueprintId)`
3. Keep all calls routed through the existing centralized API client.
4. Replace the call site that currently uses `generateMockBlueprint`.
5. Preserve the current form component and result tabs.
6. Map existing frontend field names to backend request names:
   - `companySize` -> `company_size`
   - `topPriorities` -> `top_priorities`
   - `aiJourneyStage` -> `ai_journey_stage`
   - `biggestChallenge` -> `biggest_challenge`
   - `dataReadiness` -> `data_readiness`
   - `existingSystems` -> `existing_systems`
   - `leadershipCommitment` -> `leadership_commitment`
   - `riskAppetite` -> `risk_appetite`
7. Update the frontend result type to use the backend envelope:
   - `success`
   - `data`
   - `error`
   - `meta`

## Recommended Frontend Sequence

On mount:

- call `GET /api/v1/blueprint/options`
- hydrate dropdowns from backend data
- keep existing UI widgets unchanged

On generate:

- validate the form client-side as today
- call `POST /api/v1/blueprint/generate`
- store returned `blueprint_id`
- render result tabs from backend payload

On reload or share:

- call `GET /api/v1/blueprint/{blueprint_id}`

On regenerate:

- call `POST /api/v1/blueprint/{blueprint_id}/regenerate`
- pass only changed fields in `overrides`

On export/email buttons:

- keep current button UI
- call placeholder backend endpoints
- show non-blocking "coming soon" success state

On handoff CTA:

- call `POST /api/v1/blueprint/{blueprint_id}/handoff`
- route the returned handoff summary into the next-step workflow

## Data Mapping Notes

Backend result sections already match the existing tab model:

- `Overview`
  - `profile_summary`
  - `readiness_score`
  - `readiness_category`
  - `business_impact`
- `Opportunities`
  - `top_opportunities`
  - `recommended_solutions`
- `90-Day Roadmap`
  - `roadmap_phases`
- `Architecture`
  - `architecture_layers`
  - `operating_model`
  - `recommended_agents`
- `Governance`
  - `governance_framework`
  - `assumptions`
  - `warnings`

Recommended next actions map from:

- `next_actions`

## Non-Goals For Phase 1.5

- no redesign of Blueprint UI
- no changes to homepage hero, navbar, theme, or Talk-to-Agent
- no conversion of Blueprint into a chat experience
- no removal of the mock path until real API wiring is fully verified

## Recommended Rollout

1. Add API client and types.
2. Add feature flag to choose mock vs API.
3. Wire options endpoint first.
4. Wire generate endpoint second.
5. Wire retrieve/regenerate/export/email/handoff after generate is stable.
6. Remove the frontend mock only after UI parity and regression checks pass.
