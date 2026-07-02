# Frontend Phase 2 Integration Plan

## Goal
- Connect existing conversion forms and CTA flows to the Phase 2 backend without redesigning the UI.

## Files Added
- `frontend/app/src/lib/api/analyticsApi.ts`
- `frontend/app/src/lib/api/contactApi.ts`
- `frontend/app/src/lib/api/consultationApi.ts`
- `frontend/app/src/lib/api/handoffApi.ts`

## Files Updated
- `frontend/app/src/pages/ContactPage.tsx`
- `frontend/app/src/sections/Contact.tsx`
- `frontend/app/src/sections/Hero.tsx`
- `frontend/app/src/sections/Navbar.tsx`
- `frontend/app/src/components/shared/CTAButton.tsx`
- `frontend/app/src/components/modals/BlueprintModal.tsx`
- `frontend/app/src/components/InlineAgentChat.tsx`
- `frontend/app/src/components/drawers/TalkToAgentDrawer.tsx`
- `frontend/app/src/pages/Resources.tsx`

## Form Connections
- Contact page:
  - submits to `POST /api/v1/contact`
  - tracks `contact_form_submitted` and `contact_form_failed`
  - preserves existing success-state UI
- Homepage contact section:
  - submits to `POST /api/v1/contact`
  - uses current visible fields only
  - synthesizes a structured contact message from service, country, and phone

## CTA Connections
- Hero:
  - `Generate My Enterprise AI Blueprint` tracks `hero_generate_blueprint_clicked`
  - `Talk to GFF AI` tracks `hero_talk_to_agent_clicked`
- Navbar and shared CTA buttons:
  - track `navigation_clicked`
  - consultation CTA tracks `book_consultation_clicked`
- Blueprint modal next actions:
  - `Book Workshop` calls `POST /api/v1/consultation/book`
  - `Request Proposal` calls `POST /api/v1/handoff`
  - export/email remain on existing placeholder endpoints
  - action clicks track `blueprint_next_action_clicked`
- Talk-to-Agent next actions:
  - retain current UI routing
  - track `talk_agent_next_action_clicked`
  - retain backend handoff preparation so the request is captured server-side

## Analytics Events Added
- `hero_generate_blueprint_clicked`
- `hero_talk_to_agent_clicked`
- `book_consultation_clicked`
- `contact_form_submitted`
- `contact_form_failed`
- `consultation_requested`
- `handoff_requested`
- `proposal_requested`
- `workshop_requested`
- `blueprint_next_action_clicked`
- `talk_agent_next_action_clicked`
- `resource_clicked`
- `navigation_clicked`

## Fallback Behavior
- Analytics failures are best-effort and never break the UI.
- Contact submission failures show a friendly inline error and preserve user input.
- Blueprint and Talk-to-Agent continue to keep their current fallback handling from earlier phases.

## Deferred Items
- Newsletter integration is not added because no newsletter form currently exists in the frontend.
- Real scheduling UI is deferred until calendar integration exists.
- Real CRM and email provider integrations are deferred to a later phase.
