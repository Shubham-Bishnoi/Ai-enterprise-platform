# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Primary: enterprise AI buyers - CXOs, heads of AI/data, and transformation leaders evaluating GFF AI as a transformation partner. They arrive on the public site (gffai.sg) to judge credibility and fit, and engage through the Talk to Agent discovery flow, the AI Blueprint Engine, or a contact/consultation request. (Confirmed by user, 2026-07-25.)

Secondary: onboarded clients using the client portal (dashboard, projects, documents, governance, support), segmented by `client_type`. Portal access currently uses demo auth only.

## Product Purpose

GFF AI is a real company (confirmed by user); this repo is its actual product presence. The product helps organizations discover, build, govern, and scale production-ready AI systems through strategy, agentic AI, knowledge graphs, and managed AI operations. Success means moving enterprise AI "from experiments to enterprise operations."

Current working goal (confirmed by user, 2026-07-25): **polish the demo**. Optimize for impressive controlled demos and beta walkthroughs; production hardening (real auth, rate limiting, email/storage providers) is deliberately deferred.

## Positioning

"The Enterprise AI Transformation Company." The differentiating mechanism is the **Garage → Foundry → Factory** delivery model: a named, staged journey from discovery (Garage) through build (Foundry) to production-scale operations (Factory). Site title: "Build the First AI-Native Enterprise." The Talk to Agent experience is explicitly discovery-first orchestration with specialist routing, "not a generic chatbot" (ai/README.md).

## Operating Context

- Public marketing site routes: `/`, `/capabilities`, `/industries`, `/platforms`, `/why-gff-ai`, `/build-with-gff`, `/company`, `/resources`, `/contact`, `/portal`.
- Platform lineup: Garage, Foundry, Factory, Blueprint, Marketplace, Control Center, plus vertical intelligence platforms.
- Global presence copy: "Singapore and India to London, and beyond." Production domain: gffai.sg (CNAME).
- Deploys: frontend on Vercel, backend on Render (Docker, `/api/v1/health` healthcheck), Postgres (Neon referenced in docs).

## Capabilities and Constraints

Built in phases 0-5 (docs/ is the source of truth; validated through Phase 5 on 2026-07-02):

- **Talk to Agent** (P0): discovery-first orchestration, 10-node LangGraph-ready discovery graph, five seeded specialist agents (strategy, architect, governance, industry, training), structured recommendations and next actions.
- **AI Blueprint Engine** (P1): deterministic readiness scoring and recommendations; LLM only words the summary, with deterministic fallback. Generate/regenerate/export/email/handoff.
- **Leads and engagement** (P2): contact requests, lead lifecycle, consultation bookings, handoff requests, analytics events.
- **Content/Search/Resources** (P3): backend-served content for capabilities, industries, platforms, resources, search with suggestions; hardcoded fallback remains (tracked in docs/remaining_hardcoded_content.md).
- **Client Portal** (P4): demo auth (`POST /api/v1/auth/demo-login`, token in `localStorage.gff_portal_token`), dashboard, projects, documents, governance frameworks/controls/assessments, support.

Stack: Next.js 16 / React 19 / TypeScript / Tailwind v4 / shadcn / framer-motion / three.js frontend; FastAPI / SQLAlchemy 2 / Alembic / Postgres backend; AI providers OpenAI and NVIDIA NIM with deterministic mock mode.

Hard constraints future work must respect:

- Production auth does not exist; only demo auth. Not public-production ready (docs/deployment_readiness.md): no rate limiting runtime, placeholder email/notification service, no wired object storage, PDF export is a placeholder record.
- API responses use the standard `APIResponse` envelope under `/api/v1`.
- Active frontend is `frontend/app/`; `frontend/intelligence-forge/` and `frontend/app-backup-before-new-design/` are legacy/alternate trees, not targets.

## Brand Commitments

- Name: **GFF AI**. GFF = Garage, Foundry, Factory. Domain: gffai.sg.
- Confirmed taglines: "Build the First AI-Native Enterprise"; "The Enterprise AI Transformation Company"; "Garage → Foundry → Factory"; "Every enterprise, AI-native"; "Move AI from experiments to enterprise operations."
- Voice: enterprise, outcome- and governance-oriented, discovery-first.
- Assets: `frontend/app/public/images/` - `gff-logo.png` (favicon/apple icon), `gff-emblem.png`, `hero-cockpit.png`, numbered enterprise-visual set, industry scene PNGs, scroll-sequence folders. CTA vocabulary in use: "Talk to GFF AI", "Generate Blueprint", "Explore Platform".
- Portal design constraint: the portal intentionally keeps a dark "cockpit" theme even where the public site is light (docs/portal_design_system.md).

## Evidence on Hand

- Real product copy across `frontend/app/app/*` pages and docs/ phase documents.
- 46 passing backend+AI tests; frontend production build passes (docs/deployment_readiness.md).
- No real testimonials, customer names, case-study metrics, or press found in the repo. Future work must not fabricate customers, benchmarks, pricing, or compliance claims.

## Product Principles

1. Discovery before pitch: the product leads with structured discovery (Talk to Agent, Blueprint), not generic chat or brochureware.
2. Deterministic core, LLM garnish: scoring and recommendations stay deterministic; LLMs only phrase, never decide.
3. Governance is a feature, not a footnote: governance surfaces are first-class in both marketing and portal.
4. Demo-impressive over production-complete (for now): choices should maximize controlled-demo impact; hardening is explicitly deferred.
5. Backend as source of truth: content migrates from hardcoded frontend fallbacks to the API over time.

## Accessibility & Inclusion

No product-specific accessibility standard has been established. Open decision: whether to commit to WCAG AA for the public site before public launch.
