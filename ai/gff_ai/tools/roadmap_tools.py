from gff_ai.schemas.roadmap import RoadmapPhase


def build_roadmap_phases(*, profile: dict, readiness_score: int, include_extended: bool = False) -> list[RoadmapPhase]:
    phases = [
        RoadmapPhase(
            phase_number=1,
            name="Garage",
            objective="Discovery",
            timeline="0-30 days",
            activities=[
                "Align executive goals and use-case shortlist",
                "Validate data, systems, and governance assumptions",
                "Define pilot success metrics",
            ],
            deliverables=["Readiness assessment", "Pilot charter", "Solution scope"],
        ),
        RoadmapPhase(
            phase_number=2,
            name="Foundry",
            objective="Pilot",
            timeline="31-60 days",
            activities=[
                "Launch one to two production-like pilots",
                "Instrument ROI, safety, and workflow metrics",
                "Stand up operating cadence with business owners",
            ],
            deliverables=["Pilot build", "Governance checklist", "Adoption plan"],
        ),
        RoadmapPhase(
            phase_number=3,
            name="Factory",
            objective="Enterprise Rollout",
            timeline="61-90 days",
            activities=[
                "Scale validated workflows across teams",
                "Harden integration and observability controls",
                "Prepare operating model for ongoing ownership",
            ],
            deliverables=["Rollout plan", "Control center dashboard", "Scaled architecture baseline"],
        ),
    ]
    if include_extended or readiness_score > 70 or profile.get("ai_journey_stage", "").lower() in {"scaling ai", "ai-native"}:
        phases.extend(
            [
                RoadmapPhase(
                    phase_number=4,
                    name="Operate",
                    objective="Managed AI Operations",
                    timeline="90+ days",
                    activities=["Run managed operations reviews", "Track model and agent performance"],
                    deliverables=["Operating runbook", "Managed service cadence"],
                ),
                RoadmapPhase(
                    phase_number=5,
                    name="Optimize",
                    objective="Continuous Improvement",
                    timeline="Ongoing",
                    activities=["Prioritize next-wave use cases", "Tune controls and economics"],
                    deliverables=["Optimization backlog", "Quarterly value report"],
                ),
            ]
        )
    return phases
