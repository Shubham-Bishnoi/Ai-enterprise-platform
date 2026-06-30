from sqlalchemy import select
from sqlalchemy.orm import Session, selectinload

from app.models.chat import ChatMessage, ChatSession


class ChatRepository:
    def __init__(self, db: Session) -> None:
        self.db = db

    def create_session(
        self,
        *,
        selected_agent_id: str | None,
        session_state: str,
        source_surface: str,
    ) -> ChatSession:
        session = ChatSession(
            selected_agent_id=selected_agent_id,
            session_state=session_state,
            source_surface=source_surface,
        )
        self.db.add(session)
        self.db.flush()
        self.db.refresh(session)
        return session

    def get_session(self, session_id: str) -> ChatSession | None:
        stmt = (
            select(ChatSession)
            .options(selectinload(ChatSession.messages))
            .where(ChatSession.id == session_id)
        )
        return self.db.scalar(stmt)

    def add_message(
        self,
        *,
        session_id: str,
        role: str,
        content: str,
        structured_payload: dict | None = None,
    ) -> ChatMessage:
        message = ChatMessage(
            session_id=session_id,
            role=role,
            content=content,
            structured_payload=structured_payload,
        )
        self.db.add(message)
        self.db.flush()
        self.db.refresh(message)
        return message

    def update_session(
        self,
        session: ChatSession,
        *,
        selected_agent_id: str | None = None,
        session_state: str | None = None,
        profile_json: dict | None = None,
        recommendation_json: dict | None = None,
        confidence_score: float | None = None,
    ) -> ChatSession:
        if selected_agent_id is not None:
            session.selected_agent_id = selected_agent_id
        if session_state is not None:
            session.session_state = session_state
        if profile_json is not None:
            session.profile_json = profile_json
        if recommendation_json is not None:
            session.recommendation_json = recommendation_json
        if confidence_score is not None:
            session.confidence_score = confidence_score
        self.db.add(session)
        self.db.flush()
        self.db.refresh(session)
        return session
