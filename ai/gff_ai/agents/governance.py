from gff_ai.agents.base import SpecialistAgent


GOVERNANCE_AGENT = SpecialistAgent(
    agent_id="governance",
    title="Governance Agent",
    prompt_path="prompts/agents/governance_agent.md",
)
