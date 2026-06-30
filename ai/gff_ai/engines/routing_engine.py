from dataclasses import dataclass


@dataclass
class RouteDecision:
    route: str
    confidence_score: float
    reason: str
    candidate_routes: list[str]
    intent: str


ROUTING_KEYWORDS: dict[str, tuple[str, ...]] = {
    "strategy": ("roadmap", "operating model", "transformation", "priority", "prioritize", "pilot"),
    "architect": ("architecture", "integration", "data layer", "security", "orchestration", "platform"),
    "governance": ("compliance", "risk", "governance", "audit", "policy", "controls"),
    "industry": ("industry", "use case", "sector", "banking", "manufacturing", "education"),
    "training": ("training", "academy", "workforce", "learning", "enablement", "capability"),
}


def classify_route(message: str, selected_agent_id: str | None = None) -> RouteDecision:
    lower_message = message.lower()
    scores: dict[str, int] = {agent_id: 0 for agent_id in ROUTING_KEYWORDS}

    for agent_id, keywords in ROUTING_KEYWORDS.items():
        for keyword in keywords:
            if keyword in lower_message:
                scores[agent_id] += 1

    ranked = sorted(scores.items(), key=lambda item: item[1], reverse=True)
    top_agent, top_score = ranked[0]
    second_score = ranked[1][1] if len(ranked) > 1 else 0

    if top_score == 0 and selected_agent_id:
        return RouteDecision(
            route=selected_agent_id,
            confidence_score=0.6,
            reason="No strong keyword match; preserved the user-selected specialist.",
            candidate_routes=[selected_agent_id, "strategy", "industry"],
            intent="guided_discovery",
        )

    if top_score == 0:
        return RouteDecision(
            route="strategy",
            confidence_score=0.52,
            reason="No strong keyword match; defaulted to strategy-led discovery.",
            candidate_routes=["strategy", "architect", "industry"],
            intent="guided_discovery",
        )

    confidence = min(0.55 + (top_score * 0.14), 0.95)
    if second_score == top_score:
        confidence = min(confidence, 0.64)

    candidate_routes = [agent_id for agent_id, score in ranked if score > 0][:3]
    if selected_agent_id and selected_agent_id not in candidate_routes:
        candidate_routes.append(selected_agent_id)

    return RouteDecision(
        route=selected_agent_id if confidence < 0.65 and selected_agent_id else top_agent,
        confidence_score=round(confidence, 2),
        reason=f"Matched message to {top_agent} keywords with score {top_score}.",
        candidate_routes=candidate_routes or [top_agent],
        intent=top_agent,
    )
