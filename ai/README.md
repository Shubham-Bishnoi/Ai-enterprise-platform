# GFF AI Orchestration Layer

Phase 0 AI foundation for the Talk to Agent discovery and routing system.

## Scope

- Discovery-first orchestration, not a generic chatbot
- Deterministic mock mode
- LangGraph-ready discovery flow
- Specialist routing for strategy, architect, governance, industry, and training
- Structured recommendation output for backend APIs

## Graph

The discovery graph is defined in `AI/gff_ai/graphs/discovery_graph.py`.

Nodes:

1. `load_session`
2. `classify_intent`
3. `extract_profile`
4. `determine_missing_fields`
5. `route_to_specialist`
6. `generate_specialist_response`
7. `build_recommendations`
8. `build_next_actions`
9. `persist_session`
10. `return_response`

## Providers

- `AI_PROVIDER=mock` keeps the system deterministic and offline-safe.
- `AI_PROVIDER=openai` uses `OPENAI_API_KEY`, `OPENAI_MODEL`, and optional `OPENAI_BASE_URL`.
- `AI_PROVIDER=nvidia` uses `NVIDIA_API_KEY`, `NVIDIA_MODEL`, and `NVIDIA_BASE_URL`.
- If `AI_PROVIDER=openai` but `OPENAI_API_KEY` is missing while `NVIDIA_API_KEY` is present, the provider layer falls back to NVIDIA automatically.

## Mock Mode

- Enabled with `ENABLE_AI_MOCK_MODE=true`
- Uses deterministic routing, extraction, and recommendation engines
- Validates structured schemas without any external provider

## Real Provider Mode

- `ai/gff_ai/llm/openai_client.py` now uses an OpenAI-compatible structured JSON call and validates the returned schema before handing text back to the graph.
- `ai/gff_ai/llm/nvidia_client.py` reuses the same OpenAI-compatible flow against NVIDIA NIM.

## Tests

```bash
cd AI/gff_ai/tests
PYTHONPATH="/absolute/path/to/DEMO2/backend:/absolute/path/to/DEMO2/AI" python3 -m pytest test_routing_engine.py test_profile_extractor.py test_discovery_graph.py
```
