from gff_ai.schemas.profile import ExtractedProfile
from gff_ai.schemas.recommendation import (
    NextAction,
    RecommendationBundle,
    RecommendationPath,
    RecommendedSolution,
    SuggestedQuestion,
)


AGENT_TITLES = {
    "strategy": "Strategy Agent",
    "architect": "AI Architect Agent",
    "governance": "Governance Agent",
    "industry": "Industry Agent",
    "training": "Training Advisor",
}


def build_recommendations(
    *,
    route: str,
    confidence_score: float,
    profile: ExtractedProfile,
    candidate_routes: list[str],
) -> RecommendationBundle:
    if confidence_score < 0.65:
        suggested_questions = [
            SuggestedQuestion(id="sq1", question="Which outcome matters most right now: roadmap, architecture, governance, industry use cases, or training?"),
            SuggestedQuestion(id="sq2", question="What industry and leadership role should this discovery be tailored for?"),
        ]
        recommended_paths = [
            RecommendationPath(
                id=f"path-{agent_id}",
                title=f"Explore {AGENT_TITLES.get(agent_id, agent_id.title())}",
                description=f"Preview a {agent_id} discovery path before we finalize routing.",
                agent_id=agent_id,
            )
            for agent_id in candidate_routes[:3]
        ]
        return RecommendationBundle(
            recommended_paths=recommended_paths,
            suggested_questions=suggested_questions,
            next_actions=[
                NextAction(type="clarify_route", label="Answer Clarifying Question"),
                NextAction(type="book_workshop", label="Book Workshop"),
            ],
        )

    industry_label = profile.industry or "enterprise"
    recommended_paths = [
        RecommendationPath(
            id=f"{route}-primary",
            title=f"{AGENT_TITLES[route]} Discovery Path",
            description=f"Primary path for {industry_label} discovery aligned to your stated objective.",
            agent_id=route,
        ),
        RecommendationPath(
            id=f"{route}-pilot",
            title="90-Day Pilot Path",
            description="A focused pilot plan to validate outcomes and de-risk execution.",
            agent_id="strategy",
        ),
    ]
    recommended_solutions = [
        RecommendedSolution(
            id=f"{route}-solution-1",
            name="Discovery Assessment",
            description="Structured assessment covering goals, constraints, and execution readiness.",
            category="Assessment",
        ),
        RecommendedSolution(
            id=f"{route}-solution-2",
            name="Solution Blueprint Input Pack",
            description="Actionable package that prepares Phase 1 blueprint generation.",
            category="Advisory",
        ),
    ]
    next_actions = [
        NextAction(type="generate_blueprint", label="Generate Blueprint", payload={"route": route}),
        NextAction(type="book_workshop", label="Book Workshop", payload={"route": route}),
        NextAction(type="request_handoff", label="Request Expert Handoff", payload={"route": route}),
    ]
    return RecommendationBundle(
        recommended_paths=recommended_paths,
        recommended_solutions=recommended_solutions,
        next_actions=next_actions,
    )
