from typing import Any

from gff_ai.engines.blueprint_engine import (
    generate_blueprint,
    initialize_state,
    normalize_profile,
    validate_input,
)
from gff_ai.engines.industry_pack_engine import choose_industry_pack
from gff_ai.engines.readiness_scoring import compute_readiness_score
from gff_ai.engines.recommendation_engine import recommend_blueprint_opportunities
from gff_ai.schemas.blueprint import BlueprintOutput
from gff_ai.schemas.blueprint import BlueprintState
from gff_ai.schemas.opportunity import BlueprintOpportunity
from gff_ai.schemas.profile import BlueprintProfile
from gff_ai.tools.architecture_tools import build_architecture_layers
from gff_ai.tools.blueprint_tools import (
    build_handoff_summary,
    build_next_actions,
    build_operating_model,
    build_recommended_agents,
    build_recommended_solutions,
    compose_profile_summary,
    estimate_business_impact,
)
from gff_ai.tools.governance_tools import build_governance_framework
from gff_ai.tools.roadmap_tools import build_roadmap_phases

try:
    from langgraph.graph import END, START, StateGraph
except ImportError:  # pragma: no cover - optional dependency fallback
    END = "END"
    START = "START"
    StateGraph = None


class BlueprintGraphRunner:
    def load_request(self, state: BlueprintState) -> BlueprintState:
        return state

    def validate_input(self, state: BlueprintState) -> BlueprintState:
        validate_input(state.profile)
        return state

    def normalize_profile(self, state: BlueprintState) -> BlueprintState:
        state.normalized_profile, assumptions = normalize_profile(state.profile)
        state.assumptions.extend(assumptions)
        return state

    def compute_readiness_score(self, state: BlueprintState) -> BlueprintState:
        score, category, breakdown = compute_readiness_score(state.normalized_profile or state.profile)
        state.readiness_score = score
        state.readiness_category = category
        state.readiness_breakdown = breakdown
        return state

    def select_industry_pack(self, state: BlueprintState) -> BlueprintState:
        pack, warnings = choose_industry_pack(
            industry=(state.normalized_profile or state.profile).industry,
            industry_packs=state.industry_pack.get("catalog", []),
        )
        state.industry_pack = pack
        state.industry_pack_name = pack.get("name")
        state.warnings.extend(warnings)
        return state

    def recommend_opportunities(self, state: BlueprintState) -> BlueprintState:
        profile = (state.normalized_profile or state.profile).model_dump()
        state.top_opportunities = [
            BlueprintOpportunity.model_validate(item)
            for item in recommend_blueprint_opportunities(
                profile=profile,
                industry_pack=state.industry_pack,
                use_cases=state.use_cases,
            )
        ]
        return state

    def recommend_solutions(self, state: BlueprintState) -> BlueprintState:
        state.recommended_solutions = build_recommended_solutions(
            profile=(state.normalized_profile or state.profile).model_dump()
        )
        return state

    def recommend_operating_model(self, state: BlueprintState) -> BlueprintState:
        state.operating_model = build_operating_model(profile=(state.normalized_profile or state.profile).model_dump())
        return state

    def recommend_agents(self, state: BlueprintState) -> BlueprintState:
        state.recommended_agents = build_recommended_agents(
            profile=(state.normalized_profile or state.profile).model_dump(),
            industry_pack=state.industry_pack,
        )
        return state

    def recommend_architecture(self, state: BlueprintState) -> BlueprintState:
        state.architecture_layers = build_architecture_layers(
            profile=(state.normalized_profile or state.profile).model_dump(),
            industry_pack=state.industry_pack,
        )
        return state

    def recommend_governance(self, state: BlueprintState) -> BlueprintState:
        state.governance_framework = build_governance_framework(
            industry_pack=state.industry_pack,
            priority_labels=(state.normalized_profile or state.profile).top_priorities,
        )
        return state

    def generate_roadmap(self, state: BlueprintState) -> BlueprintState:
        state.roadmap_phases = build_roadmap_phases(
            profile=(state.normalized_profile or state.profile).model_dump(),
            readiness_score=state.readiness_score or 0,
        )
        return state

    def estimate_business_impact(self, state: BlueprintState) -> BlueprintState:
        state.business_impact = estimate_business_impact(
            profile=(state.normalized_profile or state.profile).model_dump(),
            readiness_score=state.readiness_score or 0,
        )
        return state

    def compose_summary(self, state: BlueprintState) -> BlueprintState:
        state.profile_summary = compose_profile_summary(
            profile=(state.normalized_profile or state.profile).model_dump(),
            industry_pack=state.industry_pack,
            readiness_category=state.readiness_category or "AI Explorer",
        )
        return state

    def build_next_actions(self, state: BlueprintState) -> BlueprintState:
        state.next_actions = build_next_actions(state.readiness_score or 0)
        return state

    def validate_output(self, state: BlueprintState) -> BlueprintState:
        state.handoff_summary = build_handoff_summary(
            profile=(state.normalized_profile or state.profile).model_dump(),
            top_solution_names=[item.name for item in state.recommended_solutions],
        )
        return state

    def persist_result(self, state: BlueprintState) -> BlueprintState:
        return state

    def return_response(self, state: BlueprintState) -> BlueprintOutput:
        return generate_blueprint(
            profile=state.profile,
            industry_packs=[state.industry_pack] if state.industry_pack else [],
            use_cases=state.use_cases,
            request_id=state.request_id,
            blueprint_id=state.blueprint_id,
            default_industry_slug=state.industry_pack.get("slug", "generic-enterprise")
            if state.industry_pack
            else "generic-enterprise",
        )

    def invoke(self, payload: dict[str, Any]) -> BlueprintOutput:
        state = BlueprintState(**payload)
        state = self.load_request(state)
        state = self.validate_input(state)
        state = self.normalize_profile(state)
        state = self.compute_readiness_score(state)
        state = self.select_industry_pack(state)
        state = self.recommend_opportunities(state)
        state = self.recommend_solutions(state)
        state = self.recommend_operating_model(state)
        state = self.recommend_agents(state)
        state = self.recommend_architecture(state)
        state = self.recommend_governance(state)
        state = self.generate_roadmap(state)
        state = self.estimate_business_impact(state)
        state = self.compose_summary(state)
        state = self.build_next_actions(state)
        state = self.validate_output(state)
        state = self.persist_result(state)
        return self.return_response(state)


def build_blueprint_graph():
    runner = BlueprintGraphRunner()
    if StateGraph is None:
        return runner

    graph = StateGraph(BlueprintState)
    graph.add_node("load_request", runner.load_request)
    graph.add_node("validate_input", runner.validate_input)
    graph.add_node("normalize_profile", runner.normalize_profile)
    graph.add_node("compute_readiness_score", runner.compute_readiness_score)
    graph.add_node("select_industry_pack", runner.select_industry_pack)
    graph.add_node("recommend_opportunities", runner.recommend_opportunities)
    graph.add_node("recommend_solutions", runner.recommend_solutions)
    graph.add_node("recommend_operating_model", runner.recommend_operating_model)
    graph.add_node("recommend_agents", runner.recommend_agents)
    graph.add_node("recommend_architecture", runner.recommend_architecture)
    graph.add_node("recommend_governance", runner.recommend_governance)
    graph.add_node("generate_roadmap", runner.generate_roadmap)
    graph.add_node("estimate_business_impact", runner.estimate_business_impact)
    graph.add_node("compose_summary", runner.compose_summary)
    graph.add_node("build_next_actions", runner.build_next_actions)
    graph.add_node("validate_output", runner.validate_output)
    graph.add_node("persist_result", runner.persist_result)
    graph.add_edge(START, "load_request")
    graph.add_edge("load_request", "validate_input")
    graph.add_edge("validate_input", "normalize_profile")
    graph.add_edge("normalize_profile", "compute_readiness_score")
    graph.add_edge("compute_readiness_score", "select_industry_pack")
    graph.add_edge("select_industry_pack", "recommend_opportunities")
    graph.add_edge("recommend_opportunities", "recommend_solutions")
    graph.add_edge("recommend_solutions", "recommend_operating_model")
    graph.add_edge("recommend_operating_model", "recommend_agents")
    graph.add_edge("recommend_agents", "recommend_architecture")
    graph.add_edge("recommend_architecture", "recommend_governance")
    graph.add_edge("recommend_governance", "generate_roadmap")
    graph.add_edge("generate_roadmap", "estimate_business_impact")
    graph.add_edge("estimate_business_impact", "compose_summary")
    graph.add_edge("compose_summary", "build_next_actions")
    graph.add_edge("build_next_actions", "validate_output")
    graph.add_edge("validate_output", "persist_result")
    graph.add_edge("persist_result", END)
    return graph.compile()


def run_blueprint_graph(
    *,
    profile: BlueprintProfile,
    industry_packs: list[dict],
    use_cases: list[dict],
    request_id: str | None = None,
    blueprint_id: str | None = None,
    default_industry_slug: str = "generic-enterprise",
) -> BlueprintOutput:
    graph = build_blueprint_graph()
    payload = initialize_state(profile=profile, request_id=request_id).model_dump()
    payload["blueprint_id"] = blueprint_id
    payload["industry_pack"] = {"catalog": industry_packs}
    payload["use_cases"] = use_cases
    result = graph.invoke(payload)
    if isinstance(result, BlueprintOutput):
        return result
    return BlueprintGraphRunner().return_response(BlueprintState(**result))
