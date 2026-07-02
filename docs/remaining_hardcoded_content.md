# Remaining Hardcoded Content Inventory

## Purpose Of This Inventory
- This file tracks frontend-hardcoded content that still exists after Phase 3/4/5.
- Most remaining items are intentional fallback/UI-mapping layers so the site stays resilient when backend content is unavailable.
- These items are acceptable for the current MVP and demo deployment.
- Longer-term, they should move into backend-managed content models and eventually an admin/CMS layer.

## Acceptable MVP Fallbacks

### Search And Discovery
- `QuickSearch` still keeps local fallback chips and result cards from `siteContent.ts`.
- This is acceptable because search now uses backend search first and only falls back when the API is unavailable.
- Future move:
  - admin-managed search chips
  - configurable featured search results

### Talk To Agent
- `TalkToAgent`, `InlineAgentChat`, and `TalkToAgentDrawer` retain fallback agent metadata, legacy quick actions, and offline session behavior.
- This is acceptable because it prevents blank states when the backend is unavailable.
- Future move:
  - store default agent labels/colors/greetings in backend content/config
  - move legacy quick actions into seeded admin-managed content

### Blueprint
- `BlueprintGenerator` retains fallback option messaging and offline-safe UI handling.
- This is acceptable because the backend remains the primary source when reachable.
- Future move:
  - move marketing/form copy and fallback option bundles into backend-managed content

### Portal
- `Portal.tsx` keeps a local `buildPreview()` payload for preview/demo rendering before auth or when the backend is unavailable.
- This is acceptable because the portal is intentionally allowed to show a premium preview state.
- Future move:
  - move preview workspace payload into a backend preview endpoint or seeded CMS/admin source

## Remaining Frontend-Hardcoded Items

### Global Marketing Content Still Served Locally
- Navbar item definitions still come from `siteContent.ts`.
- Footer column content still comes from `siteContent.ts`.
- Several approved marketing sections still read from local content definitions:
  - `GarageFoundryFactoryJourney`
  - `GlobalPresence`
  - `ClientSuccess`
  - `InteractiveExperience`
  - company / why-GFF / build-page marketing copy
- Status:
  - acceptable for now
  - should move into content APIs later if business users need editorial control

### Homepage
- `WhatWeBuild` uses backend capabilities first, but still keeps local card content and local icon mapping.
- `LiveDashboard` still keeps:
  - fallback metric values from `siteContent.ts`
  - static side panel content from `liveDashboardPanels`
  - decorative mini-bar chart values that are purely visual
- `LatestResearch` still keeps:
  - local featured-card reading-time mappings
  - local resource type icon/color mapping
  - local fallback research items

### Resources Page
- Filter taxonomy (`resourceTypes`) remains local.
- Type-color mapping (`typeColors`) remains local.
- This is acceptable because backend resources are already the primary content source and these values mainly control UI presentation.

### Industries, Platforms, And Capabilities Pages
- Local Lucide icon maps remain in the frontend because the backend currently stores icon names/strings, not rendered icon components.
- Platform grouping presentation still depends partly on metadata-to-UI mapping in the frontend.
- This is acceptable for now.
- Future move:
  - central icon/token registry
  - admin-defined group taxonomy and accent tokens

### Contact And CTA Analytics
- CTA wiring is live, but some copy/intent labels remain hardcoded in the frontend for approved UI flows.
- This is acceptable unless marketing needs frequent edits without code deploys.

## What Should Move To Backend/Admin Next
- Navigation and footer content
- Global marketing page copy
- Search chips and featured search results
- Talk-to-Agent default quick actions and agent display metadata
- Blueprint fallback option packs and helper copy
- Portal preview payload and preview copy
- Resource type taxonomy and color tokens
- Icon/token registries for industries, platforms, and capabilities

## Recommended CMS/Admin Priorities
- Priority 1:
  - navigation/footer
  - global page copy
  - search chips / featured results
- Priority 2:
  - resource taxonomies
  - portal preview content
  - talk-to-agent quick actions
- Priority 3:
  - icon/token registries
  - decorative dashboard panel text

## Summary
- Remaining hardcoded content is mostly presentation mapping, approved marketing copy, and resilience fallback data.
- None of the remaining hardcoded items block internal deployment.
- These items should be migrated gradually into backend content/admin tooling rather than forcing a risky UI rewrite now.
