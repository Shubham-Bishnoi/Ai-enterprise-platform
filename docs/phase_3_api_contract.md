# Phase 3 — API Contract

All endpoints return the standard envelope:
`{ "success": true|false, "data": any|null, "error": { "code": str, "message": str, "details": object|null }|null, "meta": object|null }`

## Content
- `GET /api/v1/content/navigation`
- `GET /api/v1/content/footer`
- `GET /api/v1/content/home`
- `GET /api/v1/content/home/sections`
- `GET /api/v1/content/home/sections/{section_key}`
- `GET /api/v1/content/pages/{slug}`

## Capabilities
- `GET /api/v1/capabilities`
- `GET /api/v1/capabilities/{slug}`

## Industries
- `GET /api/v1/industries`
- `GET /api/v1/industries/{slug}`
- `GET /api/v1/industries/{slug}/use-cases`
- `GET /api/v1/industries/{slug}/agents`
- `GET /api/v1/industries/{slug}/reference-architecture`

## Platforms
- `GET /api/v1/platforms`
- `GET /api/v1/platforms/{slug}`

## Resources
- `GET /api/v1/resources`
- `GET /api/v1/resources/{slug}`
- `GET /api/v1/resources/types`
- `GET /api/v1/resources/featured`

## Search
- `GET /api/v1/search?q=`
- `GET /api/v1/search/suggestions?q=`
- `GET /api/v1/search/index`

## Dashboard
- `GET /api/v1/dashboard/metrics`
- `GET /api/v1/dashboard/activity`
