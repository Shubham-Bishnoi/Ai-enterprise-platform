from gff_ai.agents.base import SpecialistAgent


INDUSTRY_AGENT = SpecialistAgent(
    agent_id="industry",
    title="Industry Agent",
    prompt_path="prompts/agents/industry_agent.md",
)
