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


def recommend_blueprint_opportunities(
    *,
    profile: dict,
    industry_pack: dict,
    use_cases: list[dict],
) -> list[dict]:
    opportunities: list[dict] = []
    biggest_challenge = profile.get("biggest_challenge", "")
    priorities = set(profile.get("top_priorities", []))
    for use_case in use_cases[:3]:
        opportunities.append(
            {
                "title": use_case["title"],
                "description": use_case["description"],
                "business_area": use_case.get("capability_slug") or "enterprise-operations",
                "impact": use_case.get("impact_level", "Medium"),
                "complexity": use_case.get("complexity", "Medium"),
                "time_to_value": use_case.get("time_to_value", "60-90 days"),
                "recommended_agent": use_case.get("recommended_agent") or "Strategy Agent",
                "why_it_matters": (
                    f"Addresses {biggest_challenge.lower()} while aligning to "
                    f"{', '.join(profile.get('top_priorities', [])) or 'enterprise priorities'}."
                ),
                "suggested_first_step": "Validate data dependencies, workflow owner, and success metrics.",
                "tags": use_case.get("tags", []),
            }
        )

    if biggest_challenge == "Data Quality":
        opportunities.insert(
            0,
            {
                "title": "Knowledge Graph Factory",
                "description": "Build a governed data and document layer to improve retrieval quality and downstream AI reliability.",
                "business_area": "data-and-intelligence",
                "impact": "High",
                "complexity": "Medium",
                "time_to_value": "30-60 days",
                "recommended_agent": "Data Governance Agent",
                "why_it_matters": "Improves foundation quality before scaling copilots and workflow agents.",
                "suggested_first_step": "Inventory authoritative sources, critical documents, and metadata gaps.",
                "tags": ["data", "governance", "knowledge-graph"],
            },
        )
    if "Compliance" in priorities:
        opportunities.append(
            {
                "title": "Compliance Copilot",
                "description": "Support policy review, evidence collection, and audit preparation with governed AI workflows.",
                "business_area": "risk-and-compliance",
                "impact": "High",
                "complexity": "Medium",
                "time_to_value": "30-60 days",
                "recommended_agent": "Compliance Copilot",
                "why_it_matters": "Reduces manual review cycles and improves audit readiness.",
                "suggested_first_step": "Map key policies, controls, and approval checkpoints.",
                "tags": ["compliance", "governance"],
            }
        )
    if "Cost Reduction" in priorities:
        opportunities.append(
            {
                "title": "Process Automation Agent",
                "description": "Automate repetitive workflows and route exceptions for human review.",
                "business_area": "operations",
                "impact": "High",
                "complexity": "Low",
                "time_to_value": "30-45 days",
                "recommended_agent": "Process Automation Agent",
                "why_it_matters": "Targets operating cost and manual effort in high-volume workflows.",
                "suggested_first_step": "Select one high-friction workflow with measurable cycle time.",
                "tags": ["automation", "cost"],
            }
        )
    if profile.get("ai_journey_stage") == "Just Starting":
        opportunities.append(
            {
                "title": "Garage Discovery Workshop",
                "description": "Run a rapid discovery sprint to frame one pilot and governance guardrails.",
                "business_area": "strategy",
                "impact": "Medium",
                "complexity": "Low",
                "time_to_value": "0-30 days",
                "recommended_agent": "Strategy Agent",
                "why_it_matters": "Helps early-stage teams avoid overbuilding and focus on evidence-backed pilots.",
                "suggested_first_step": "Confirm sponsor, process owner, and baseline KPI targets.",
                "tags": ["workshop", "pilot"],
            }
        )
    if profile.get("ai_journey_stage") == "Scaling AI":
        opportunities.append(
            {
                "title": "Agent Factory Control Center",
                "description": "Standardize build, deployment, governance, and value measurement for multiple agents.",
                "business_area": "platform",
                "impact": "High",
                "complexity": "High",
                "time_to_value": "60-90 days",
                "recommended_agent": "Control Center",
                "why_it_matters": "Supports scaling without losing operating discipline or governance visibility.",
                "suggested_first_step": "Define reusable architecture standards, approvals, and reporting cadence.",
                "tags": ["scale", "platform", "control-center"],
            }
        )

    seen_titles: set[str] = set()
    deduped: list[dict] = []
    for item in opportunities:
        if item["title"] in seen_titles:
            continue
        seen_titles.add(item["title"])
        deduped.append(item)
    return deduped[:5]
