from gff_ai.agents.base import SpecialistAgent


TRAINING_AGENT = SpecialistAgent(
    agent_id="training",
    title="Training Advisor",
    prompt_path="prompts/agents/training_agent.md",
)
