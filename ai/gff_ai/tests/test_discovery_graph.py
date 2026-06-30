from gff_ai.graphs.discovery_graph import run_discovery_graph


def test_discovery_graph_returns_structured_recommendation():
    result = run_discovery_graph(
        session_id="test-session",
        latest_user_message="Help me design AI architecture and integration for a banking platform.",
        selected_agent_id="architect",
    )

    assert result.route == "architect"
    assert result.state == "recommendation_ready"
    assert result.recommendations
    assert result.next_actions


def test_discovery_graph_low_confidence_returns_clarifying_state():
    result = run_discovery_graph(
        session_id="test-session-low-confidence",
        latest_user_message="Can you advise us?",
    )

    assert result.state == "clarifying"
    assert len(result.suggested_questions) >= 1
