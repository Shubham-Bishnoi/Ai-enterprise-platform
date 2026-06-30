from gff_ai.graphs.discovery_graph import run_discovery_graph


def run_supervisor_graph(
    *,
    session_id: str,
    latest_user_message: str,
    selected_agent_id: str | None = None,
    messages: list[dict[str, str]] | None = None,
):
    return run_discovery_graph(
        session_id=session_id,
        latest_user_message=latest_user_message,
        selected_agent_id=selected_agent_id,
        messages=messages,
    )
