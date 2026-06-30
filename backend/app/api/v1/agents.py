from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.schemas.agents import AgentOut, CreateSessionRequest, QuickActionRequest, SessionCreatedData
from app.schemas.chat import ChatRequest, ChatResponseData, HandoffRequest, HandoffResponseData, SessionSnapshot
from app.schemas.common import APIResponse
from app.services.agent_service import AgentService
from app.services.chat_service import ChatService

router = APIRouter(prefix="/agents", tags=["agents"])


@router.get("", response_model=APIResponse[list[AgentOut]])
def list_agents(db: Session = Depends(get_db)) -> APIResponse[list[AgentOut]]:
    data = AgentService(db).list_agents()
    return APIResponse(success=True, data=data, error=None)


@router.get("/{agent_id}", response_model=APIResponse[AgentOut])
def get_agent(agent_id: str, db: Session = Depends(get_db)) -> APIResponse[AgentOut]:
    data = AgentService(db).get_agent(agent_id)
    return APIResponse(success=True, data=data, error=None)


@router.post("/session", response_model=APIResponse[SessionCreatedData])
def create_session(payload: CreateSessionRequest, db: Session = Depends(get_db)) -> APIResponse[SessionCreatedData]:
    data = ChatService(db).create_session(payload)
    return APIResponse(success=True, data=data, error=None)


@router.get("/session/{session_id}", response_model=APIResponse[SessionSnapshot])
def load_session(session_id: str, db: Session = Depends(get_db)) -> APIResponse[SessionSnapshot]:
    data = ChatService(db).get_session(session_id)
    return APIResponse(success=True, data=data, error=None)


@router.post("/chat", response_model=APIResponse[ChatResponseData])
def send_message(payload: ChatRequest, db: Session = Depends(get_db)) -> APIResponse[ChatResponseData]:
    data = ChatService(db).send_message(payload)
    return APIResponse(success=True, data=data, error=None)


@router.post("/quick-action", response_model=APIResponse[ChatResponseData])
def trigger_quick_action(payload: QuickActionRequest, db: Session = Depends(get_db)) -> APIResponse[ChatResponseData]:
    data = ChatService(db).trigger_quick_action(payload)
    return APIResponse(success=True, data=data, error=None)


@router.post("/handoff", response_model=APIResponse[HandoffResponseData])
def prepare_handoff(payload: HandoffRequest, db: Session = Depends(get_db)) -> APIResponse[HandoffResponseData]:
    data = ChatService(db).prepare_handoff(payload)
    return APIResponse(success=True, data=data, error=None)
