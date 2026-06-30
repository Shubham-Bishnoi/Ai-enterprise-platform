from pydantic import BaseModel, Field

from app.schemas.chat import ChatMessageOut, SessionState


class QuickAction(BaseModel):
    id: str
    label: str
    prompt: str


class AgentOut(BaseModel):
    id: str
    slug: str
    name: str
    title: str
    subtitle: str
    description: str
    greeting: str
    icon: str
    image_url: str | None = None
    status: str
    quick_actions: list[QuickAction] = Field(default_factory=list)


class CreateSessionRequest(BaseModel):
    selected_agent_id: str | None = None
    initial_prompt: str | None = None
    quick_action_id: str | None = None
    source_surface: str = "homepage_inline_chat"
    page_context: str | None = None


class SessionCreatedData(BaseModel):
    session_id: str
    state: SessionState
    selected_agent: AgentOut | None = None
    messages: list[ChatMessageOut] = Field(default_factory=list)
    quick_actions: list[QuickAction] = Field(default_factory=list)


class QuickActionRequest(BaseModel):
    session_id: str
    quick_action_id: str
    selected_agent_id: str | None = None
