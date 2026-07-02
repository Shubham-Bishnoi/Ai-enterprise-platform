from gff_ai.schemas.blueprint import (
    BusinessImpactEstimate,
    HandoffSummary,
    NextAction,
    OperatingModelRecommendation,
    RecommendedAgent,
    RecommendedSolution,
)


def compose_profile_summary(*, profile: dict, industry_pack: dict, readiness_category: str) -> str:
    priorities = ", ".join(profile.get("top_priorities", []))
    return (
        f"{industry_pack.get('name', 'Generic Enterprise')} profile for a {profile.get('company_size')} organization "
        f"focused on {priorities or 'enterprise transformation'}. "
        f"The current journey stage is {profile.get('ai_journey_stage')} with a readiness posture of {readiness_category}."
    )


def build_operating_model(*, profile: dict) -> list[OperatingModelRecommendation]:
    stage = profile.get("ai_journey_stage", "")
    if stage.lower() in {"just starting", "no ai", "exploring ai", "exploring"}:
        return [
            OperatingModelRecommendation(
                name="Garage Discovery Model",
                description="Small cross-functional team with executive sponsor, business owner, and solution lead.",
                capabilities=["Use-case triage", "Readiness review", "Pilot governance"],
            ),
            OperatingModelRecommendation(
                name="Pilot Steering Cadence",
                description="Bi-weekly operating forum to review adoption, risk, and business outcomes.",
                capabilities=["Decision logs", "Issue escalation", "Value tracking"],
            ),
        ]
    return [
        OperatingModelRecommendation(
            name="Agent Factory",
            description="Standardized operating model for building, governing, and scaling domain agents.",
            capabilities=["Reusable components", "Release management", "Portfolio governance"],
        ),
        OperatingModelRecommendation(
            name="Managed AI Operations",
            description="Run-state operating model for monitoring AI systems, value realization, and compliance.",
            capabilities=["SRE + AI ops", "Risk review", "Quarterly optimization"],
        ),
    ]


def build_recommended_agents(*, profile: dict, industry_pack: dict) -> list[RecommendedAgent]:
    agents = industry_pack.get("recommended_agents", [])[:4]
    return [
        RecommendedAgent(
            name=agent_name,
            purpose=f"Supports {profile.get('biggest_challenge').lower()} and priority execution.",
            trigger=f"Recommended for {profile.get('industry')} organizations prioritizing {profile.get('top_priorities', ['transformation'])[0]}.",
        )
        for agent_name in agents
    ]


def build_recommended_solutions(*, profile: dict) -> list[RecommendedSolution]:
    solutions = [
        RecommendedSolution(
            name="AI Readiness Assessment",
            category="Assessment",
            description="Structured baseline of business need, data posture, and transformation readiness.",
            rationale="Provides deterministic prioritization and governance input before build decisions.",
        ),
        RecommendedSolution(
            name="90-Day Pilot",
            category="Pilot",
            description="Focused implementation around one or two high-value workflows.",
            rationale="Balances speed-to-value with measurable execution control.",
        ),
    ]
    priorities = set(profile.get("top_priorities", []))
    if "Compliance" in priorities:
        solutions.append(
            RecommendedSolution(
                name="AI Governance Framework",
                category="Governance",
                description="Control framework for policy, oversight, approvals, and audit evidence.",
                rationale="Reduces compliance and operational risk while enabling scaled adoption.",
            )
        )
    if "Cost Reduction" in priorities:
        solutions.append(
            RecommendedSolution(
                name="Managed AI Operations",
                category="Operations",
                description="Operational model for uptime, economics, and continuous optimization.",
                rationale="Supports cost discipline and measurable value realization over time.",
            )
        )
    return solutions


def estimate_business_impact(*, profile: dict, readiness_score: int) -> list[BusinessImpactEstimate]:
    scale_hint = "5-10%" if readiness_score <= 50 else "10-20%"
    return [
        BusinessImpactEstimate(
            metric="Productivity",
            expected_range=f"Expected range: {scale_hint} workflow efficiency improvement",
            description="Directional estimate based on automation and knowledge-access improvements, not a guaranteed outcome.",
        ),
        BusinessImpactEstimate(
            metric="Cycle Time",
            expected_range="Expected range: 15-30% faster decision or case handling cycles",
            description="Directional estimate contingent on process adoption and integration quality.",
        ),
        BusinessImpactEstimate(
            metric="Risk Reduction",
            expected_range="Expected range: moderate improvement in auditability and control coverage",
            description="Directional estimate tied to governance adoption, operating discipline, and data quality.",
        ),
    ]


def build_next_actions(readiness_score: int) -> list[NextAction]:
    actions: list[NextAction] = []
    if readiness_score <= 50:
        actions.extend(
            [
                NextAction(action_key="book_workshop", label="Book Workshop", description="Run a readiness and use-case workshop."),
                NextAction(action_key="talk_to_agent", label="Talk to AI Specialist", description="Refine problem framing and priorities."),
                NextAction(
                    action_key="generate_readiness_assessment",
                    label="Generate Readiness Assessment",
                    description="Capture a more detailed readiness baseline.",
                ),
            ]
        )
    elif readiness_score <= 70:
        actions.extend(
            [
                NextAction(action_key="start_pilot", label="Start 90-Day Pilot", description="Launch a controlled pilot with clear metrics."),
                NextAction(action_key="request_proposal", label="Request Proposal", description="Prepare scope, cost range, and delivery plan."),
                NextAction(action_key="talk_to_agent", label="Talk to AI Architect", description="Review architecture and delivery sequencing."),
            ]
        )
    elif readiness_score <= 85:
        actions.extend(
            [
                NextAction(action_key="scale_agent_factory", label="Scale Agent Factory", description="Standardize build and rollout across teams."),
                NextAction(
                    action_key="build_governance_framework",
                    label="Build Governance Framework",
                    description="Operationalize controls, approvals, and observability.",
                ),
                NextAction(
                    action_key="book_workshop",
                    label="Book Enterprise Rollout Workshop",
                    description="Align enterprise rollout plan, ownership, and success measures.",
                ),
            ]
        )
    else:
        actions.extend(
            [
                NextAction(
                    action_key="managed_ai_operations",
                    label="Managed AI Operations",
                    description="Operationalize run-state monitoring and optimization.",
                ),
                NextAction(action_key="control_center", label="Control Center", description="Expand portfolio governance and observability."),
                NextAction(
                    action_key="enterprise_ai_operating_model",
                    label="Enterprise AI Operating Model",
                    description="Formalize platform, ownership, and governance at scale.",
                ),
                NextAction(
                    action_key="strategic_partnership",
                    label="Strategic Partnership",
                    description="Align long-term roadmap, operating model, and value realization.",
                ),
            ]
        )
    actions.extend(
        [
            NextAction(action_key="download_blueprint", label="Download Blueprint", description="Export the current blueprint output."),
            NextAction(action_key="email_blueprint", label="Email Blueprint", description="Email the blueprint to stakeholders."),
        ]
    )
    return actions


def build_handoff_summary(*, profile: dict, top_solution_names: list[str]) -> HandoffSummary:
    return HandoffSummary(
        workshop_type="Blueprint Validation Workshop",
        executive_summary=(
            f"Prioritize a {profile.get('industry')} blueprint workshop centered on {profile.get('biggest_challenge').lower()} "
            f"and the first-wave solutions: {', '.join(top_solution_names[:3])}."
        ),
        recommended_scope=top_solution_names[:3] or ["AI Readiness Assessment", "90-Day Pilot"],
        suggested_attendees=[
            "Executive sponsor",
            "Business process owner",
            "Data/IT lead",
            "Risk or compliance owner",
        ],
    )
