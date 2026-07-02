# Frontend Phase 3 Integration Plan

## Principles
- Backend is primary source.
- Existing hardcoded content remains as fallback.
- Analytics must be best-effort only.

## Implemented Mappings
- QuickSearch → `/api/v1/search` + `/api/v1/search/index` with `siteContent.ts` fallback.
- LatestResearch → `/api/v1/resources/featured` with `siteContent.ts` fallback.
- LiveDashboard metrics/activity → `/api/v1/dashboard/*` with `siteContent.ts` fallback.
- Capabilities/Industries/Platforms/Resources pages → backend primary, existing arrays fallback.

## Notes
- Portal token header is only attached when `localStorage.gff_portal_token` exists.
- Non-portal pages remain unaffected.
