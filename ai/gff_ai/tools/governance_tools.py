from gff_ai.schemas.governance import GovernancePillar


GOVERNANCE_PILLARS = [
    "Trust",
    "Risk",
    "Security",
    "Compliance",
    "Ethics",
    "Auditability",
    "Human Oversight",
]


def build_governance_framework(*, industry_pack: dict, priority_labels: list[str]) -> list[GovernancePillar]:
    pack_controls = industry_pack.get("governance_priorities", [])
    compliance_priority = "high" if any(label.lower() == "compliance" for label in priority_labels) else "medium"
    pillars: list[GovernancePillar] = []
    for pillar in GOVERNANCE_PILLARS:
        controls = [
            f"{pillar} policy baseline",
            f"{pillar} monitoring cadence",
        ]
        if pack_controls:
            controls.append(pack_controls[min(len(pack_controls) - 1, len(pillars))])
        pillars.append(
            GovernancePillar(
                name=pillar,
                controls=controls,
                priority="high" if pillar == "Compliance" else compliance_priority,
            )
        )
    return pillars
