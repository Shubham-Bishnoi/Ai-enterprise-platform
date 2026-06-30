from gff_ai.agents.base import SpecialistAgent


STRATEGY_AGENT = SpecialistAgent(
    agent_id="strategy",
    title="Strategy Agent",
    prompt_path="prompts/agents/strategy_agent.md",
)
