from dataclasses import dataclass


@dataclass
class SpecialistAgent:
    agent_id: str
    title: str
    prompt_path: str
