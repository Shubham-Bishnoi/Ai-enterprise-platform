from gff_ai.engines.routing_engine import classify_route


def test_routing_engine_matches_governance_keywords():
    decision = classify_route("We need compliance automation and audit policy workflows.")

    assert decision.route == "governance"
    assert decision.confidence_score >= 0.65


def test_routing_engine_low_confidence_defaults_to_strategy():
    decision = classify_route("We want general help.", selected_agent_id=None)

    assert decision.route == "strategy"
    assert decision.confidence_score < 0.65
