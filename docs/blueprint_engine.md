# Blueprint Engine Design

## Purpose

The Blueprint Engine is a hybrid recommendation system, not a chatbot.

It combines:

- structured profile input
- deterministic readiness scoring
- seeded industry packs
- seeded use cases
- deterministic architecture, governance, and roadmap builders
- optional provider-based summary wording

## Core Rules

- No randomness in scoring
- No unvalidated free text output
- LLM usage is optional and bounded
- All output must validate against Pydantic schemas
- Unknown industries fall back to `generic-enterprise`
- Missing advanced values use conservative defaults

## Input Normalization

Conservative defaults:

- `data_readiness`
  - low-stage orgs default to `Highly fragmented`
  - pilot-stage orgs default to `Partially connected`
  - later-stage orgs default to `Mostly integrated`
- `leadership_commitment`
  - early stage defaults to `Not Discussed`
  - exploration or pilots default to `Exploring`
  - scaling defaults to `Budget Approved`
- `risk_appetite`
  - defaults to `Conservative`

## Readiness Formula

```text
Blueprint Score =
0.20 * AI Maturity
+ 0.25 * Business Need
+ 0.20 * Data Readiness
+ 0.20 * Process Complexity
+ 0.15 * Transformation Readiness
```

### Score Maps

AI maturity:

- `No AI` -> `10`
- `Just Starting` -> `20`
- `Exploring AI` or `Exploring` -> `30`
- `Running Pilots` or `Piloting` -> `60`
- `Scaling AI` or `Scaling` -> `85`
- `AI-Driven Enterprise`, `AI-Native`, `Transforming` -> `100`

Business need:

- `Cost Reduction` -> `20`
- `Productivity` -> `20`
- `Customer Experience` -> `15`
- `Revenue Growth` -> `15`
- `Compliance` -> `10`
- `AI Transformation` -> `20`
- `Automate Processes` -> `15`
- `Faster Decision Making` -> `15`
- `Employee Experience` -> `10`

Data readiness:

- `Highly fragmented` -> `20`
- `Partially connected` -> `50`
- `Mostly integrated` -> `75`
- `Fully integrated` -> `100`

Process complexity:

- `Startup` or `<100` -> `20`
- `SMB` or `100-1000` -> `50`
- `Enterprise` or `1000-10000` -> `80`
- `Large Enterprise` or `10000+` -> `100`

Transformation readiness:

- `Not Discussed` -> `20`
- `Exploring` -> `50`
- `Budget Approved` -> `80`
- `Executive Mandate` -> `100`

### Categories

- `0-25`: `AI Beginner`
- `26-50`: `AI Explorer`
- `51-70`: `AI Adopter`
- `71-85`: `AI Transformer`
- `86-100`: `AI-Native Leader`

## Industry Packs

Seeded packs:

- Banking / Financial Services
- Insurance
- Healthcare
- Manufacturing
- Retail
- Education
- Government
- Mining
- Energy
- Telecom
- Audit
- Tax
- Legal
- Generic Enterprise

Each pack includes:

- common challenges
- recommended use cases
- architecture hints
- governance priorities
- recommended agents
- business outcomes

## Recommendation Logic

Hard-coded deterministic rules include:

- `Data Quality`
  - recommend `Knowledge Graph Factory`
  - emphasize `Data & Intelligence Layer`
  - recommend `Data Governance Agent`
- `Compliance`
  - recommend `AI Governance Framework`
  - add governance and audit-heavy opportunities
- `Cost Reduction`
  - recommend `Process Automation Agent`
  - add operational efficiency focus
- `Just Starting`
  - bias toward `Garage Discovery Workshop`
  - bias toward readiness assessment and pilot setup
- `Scaling AI`
  - bias toward `Agent Factory`
  - bias toward control center and managed operations

## Architecture Logic

Always returns the required five layers:

1. `Data & Intelligence Layer`
2. `AI & Agent Layer`
3. `Orchestration Layer`
4. `Integration Layer`
5. `Governance & Observability Layer`

The integration layer is influenced by known existing systems such as `CRM`, `ERP`, `Claims System`, `MES`, or `SCADA`.

## Governance Logic

Always returns these pillars:

- `Trust`
- `Risk`
- `Security`
- `Compliance`
- `Ethics`
- `Auditability`
- `Human Oversight`

Controls are seeded from industry governance priorities plus deterministic baseline controls.

## Roadmap Logic

Default phases:

1. `Garage` -> `Discovery`, `0-30 days`
2. `Foundry` -> `Pilot`, `31-60 days`
3. `Factory` -> `Enterprise Rollout`, `61-90 days`

Optional phases are added for more mature or scaling profiles:

4. `Operate` -> `Managed AI Operations`
5. `Optimize` -> `Continuous Improvement`

## Business Impact Logic

Business impact is intentionally cautious:

- directional estimates only
- no guaranteed ROI claims
- phrased as expected ranges

## Next Action Routing

Score `<= 50`:

- `Book Workshop`
- `Talk to AI Specialist`
- `Generate Readiness Assessment`

Score `51-70`:

- `Start 90-Day Pilot`
- `Request Proposal`
- `Talk to AI Architect`

Score `71-85`:

- `Scale Agent Factory`
- `Build Governance Framework`
- `Book Enterprise Rollout Workshop`

Score `> 85`:

- `Managed AI Operations`
- `Control Center`
- `Enterprise AI Operating Model`
- `Strategic Partnership`

Always included:

- `Download Blueprint`
- `Email Blueprint`

## Mock And Provider Behavior

Mock mode:

- deterministic summary text
- no external calls
- same schema as real mode

Provider mode:

- deterministic sections still built in code
- provider only refines summary wording
- failure falls back to deterministic summary and adds a warning
