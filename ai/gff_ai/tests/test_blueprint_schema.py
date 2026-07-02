from gff_ai.schemas.blueprint import BlueprintOutput


def test_blueprint_output_schema_validates_complete_payload():
    payload = {
        "id": "bp_1",
        "request_id": "req_1",
        "generated_at": "2026-07-01T00:00:00Z",
        "input_profile": {
            "industry": "Insurance",
            "company_size": "Startup",
            "top_priorities": ["Cost Reduction"],
            "ai_journey_stage": "Just Starting",
            "biggest_challenge": "Data Quality",
            "email": "user@company.com",
            "existing_systems": ["CRM"],
            "source": "homepage_blueprint",
        },
        "profile_summary": "Summary",
        "readiness_score": 34,
        "readiness_category": "AI Explorer",
        "readiness_breakdown": {
            "ai_maturity": 20,
            "business_need": 20,
            "data_readiness": 50,
            "process_complexity": 20,
            "transformation_readiness": 50,
            "weighted_score": 34,
        },
        "top_opportunities": [
            {
                "title": "Knowledge Graph Factory",
                "description": "Build a governed data layer.",
                "business_area": "data-and-intelligence",
                "impact": "High",
                "complexity": "Medium",
                "time_to_value": "30-60 days",
                "recommended_agent": "Data Governance Agent",
                "why_it_matters": "Improves foundation quality.",
                "suggested_first_step": "Inventory data sources.",
            }
        ],
        "recommended_solutions": [{"name": "AI Readiness Assessment", "category": "Assessment", "description": "Assess readiness.", "rationale": "Sets a baseline."}],
        "operating_model": [{"name": "Garage Discovery Model", "description": "Cross-functional team", "capabilities": ["triage"]}],
        "recommended_agents": [{"name": "Governance Agent", "purpose": "Supports governance", "trigger": "Compliance priority"}],
        "architecture_layers": [{"name": "Data & Intelligence Layer", "description": "Unified data", "technologies": ["Warehouse"], "controls": ["Lineage"]}],
        "governance_framework": [{"name": "Trust", "controls": ["Policy baseline"], "priority": "medium"}],
        "roadmap_phases": [{"phase_number": 1, "name": "Garage", "objective": "Discovery", "timeline": "0-30 days", "activities": ["Assess"], "deliverables": ["Charter"]}],
        "business_impact": [{"metric": "Productivity", "expected_range": "Expected range: 5-10%", "description": "Directional estimate."}],
        "next_actions": [{"action_key": "download_blueprint", "label": "Download Blueprint", "description": "Export output"}],
        "confidence_score": 0.8,
        "assumptions": ["Risk appetite defaulted to Conservative."],
        "warnings": [],
        "handoff_summary": {
            "workshop_type": "Blueprint Validation Workshop",
            "executive_summary": "Executive summary",
            "recommended_scope": ["AI Readiness Assessment"],
            "suggested_attendees": ["Executive sponsor"],
        },
    }

    result = BlueprintOutput.model_validate(payload)

    assert result.readiness_category == "AI Explorer"
    assert result.top_opportunities[0].title == "Knowledge Graph Factory"
