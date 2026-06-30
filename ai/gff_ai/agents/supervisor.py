from gff_ai.agents.base import SpecialistAgent


SUPERVISOR_AGENT = SpecialistAgent(
    agent_id="supervisor",
    title="GFF AI Discovery Supervisor",
    prompt_path="prompts/system/gff_supervisor.md",
)
