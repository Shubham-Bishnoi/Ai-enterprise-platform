from gff_ai.engines.routing_engine import classify_route


def route_message(message: str, selected_agent_id: str | None = None):
    return classify_route(message=message, selected_agent_id=selected_agent_id)
