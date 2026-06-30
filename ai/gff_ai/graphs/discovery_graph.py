from typing import Any

from gff_ai.engines.profile_extractor import extract_profile
from gff_ai.engines.recommendation_engine import build_recommendations
from gff_ai.engines.routing_engine import classify_route
from gff_ai.llm.provider import get_llm_client
from gff_ai.schemas.discovery import DiscoveryMessage, DiscoveryResult, DiscoveryState

try:
    from langgraph.graph import END, START, StateGraph
except ImportError:  # pragma: no cover - optional dependency fallback
    END = "END"
    START = "START"
    StateGraph = None


class DiscoveryGraphRunner:
    def load_session(self, state: DiscoveryState) -> DiscoveryState:
        return state

    def classify_intent(self, state: DiscoveryState) -> DiscoveryState:
        decision = classify_route(
            message=state.latest_user_message,
            selected_agent_id=state.selected_agent_id,
        )
        state.intent = decision.intent
        state.route = decision.route
        state.confidence_score = decision.confidence_score
        state.candidate_routes = decision.candidate_routes
        state.metadata["routing_reason"] = decision.reason
        return state

    def extract_profile(self, state: DiscoveryState) -> DiscoveryState:
        extraction = extract_profile(state.latest_user_message)
        state.extracted_profile = extraction.profile
        state.missing_fields = extraction.missing_fields
        return state

    def determine_missing_fields(self, state: DiscoveryState) -> DiscoveryState:
        if state.confidence_score < 0.65 and "objective" not in state.missing_fields:
            state.missing_fields.append("objective")
        return state

    def route_to_specialist(self, state: DiscoveryState) -> DiscoveryState:
        if not state.route:
            state.route = "strategy"
        return state

    def generate_specialist_response(self, state: DiscoveryState) -> DiscoveryState:
        client = get_llm_client()
        state.specialist_response = client.generate_specialist_response(
            route=state.route or "strategy",
            profile=state.extracted_profile,
            confidence_score=state.confidence_score,
            latest_user_message=state.latest_user_message,
        )
        return state

    def build_recommendations(self, state: DiscoveryState) -> DiscoveryState:
        bundle = build_recommendations(
            route=state.route or "strategy",
            confidence_score=state.confidence_score,
            profile=state.extracted_profile,
            candidate_routes=state.candidate_routes or [state.route or "strategy"],
        )
        state.recommendations = bundle.recommended_paths
        state.recommended_solutions = bundle.recommended_solutions
        state.suggested_questions = bundle.suggested_questions
        state.next_actions = bundle.next_actions
        return state

    def build_next_actions(self, state: DiscoveryState) -> DiscoveryState:
        return state

    def persist_session(self, state: DiscoveryState) -> DiscoveryState:
        return state

    def return_response(self, state: DiscoveryState) -> DiscoveryResult:
        final_state = "clarifying" if state.confidence_score < 0.65 else "recommendation_ready"
        return DiscoveryResult(
            state=final_state,
            route=state.route or "strategy",
            confidence_score=state.confidence_score,
            extracted_profile=state.extracted_profile,
            specialist_response=state.specialist_response,
            recommendations=state.recommendations,
            recommended_solutions=state.recommended_solutions,
            suggested_questions=state.suggested_questions,
            next_actions=state.next_actions,
            missing_fields=state.missing_fields,
            candidate_routes=state.candidate_routes,
        )

    def invoke(self, payload: dict[str, Any]) -> DiscoveryResult:
        state = DiscoveryState(**payload)
        state = self.load_session(state)
        state = self.classify_intent(state)
        state = self.extract_profile(state)
        state = self.determine_missing_fields(state)
        state = self.route_to_specialist(state)
        state = self.generate_specialist_response(state)
        state = self.build_recommendations(state)
        state = self.build_next_actions(state)
        state = self.persist_session(state)
        return self.return_response(state)


def build_discovery_graph():
    runner = DiscoveryGraphRunner()
    if StateGraph is None:
        return runner

    graph = StateGraph(DiscoveryState)
    graph.add_node("load_session", runner.load_session)
    graph.add_node("classify_intent", runner.classify_intent)
    graph.add_node("extract_profile", runner.extract_profile)
    graph.add_node("determine_missing_fields", runner.determine_missing_fields)
    graph.add_node("route_to_specialist", runner.route_to_specialist)
    graph.add_node("generate_specialist_response", runner.generate_specialist_response)
    graph.add_node("build_recommendations", runner.build_recommendations)
    graph.add_node("build_next_actions", runner.build_next_actions)
    graph.add_node("persist_session", runner.persist_session)

    graph.add_edge(START, "load_session")
    graph.add_edge("load_session", "classify_intent")
    graph.add_edge("classify_intent", "extract_profile")
    graph.add_edge("extract_profile", "determine_missing_fields")
    graph.add_edge("determine_missing_fields", "route_to_specialist")
    graph.add_edge("route_to_specialist", "generate_specialist_response")
    graph.add_edge("generate_specialist_response", "build_recommendations")
    graph.add_edge("build_recommendations", "build_next_actions")
    graph.add_edge("build_next_actions", "persist_session")
    graph.add_edge("persist_session", END)
    return graph.compile()


def run_discovery_graph(
    *,
    session_id: str,
    latest_user_message: str,
    selected_agent_id: str | None = None,
    messages: list[dict[str, str]] | None = None,
) -> DiscoveryResult:
    graph = build_discovery_graph()
    payload = {
        "session_id": session_id,
        "selected_agent_id": selected_agent_id,
        "messages": [DiscoveryMessage(**message) for message in (messages or [])],
        "latest_user_message": latest_user_message,
    }
    result = graph.invoke(payload)
    if isinstance(result, DiscoveryResult):
        return result
    return DiscoveryGraphRunner().return_response(DiscoveryState(**result))
