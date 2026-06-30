from typing import Any

from sqlalchemy.orm import Session

from app.core.errors import ApiException
from app.models.chat import ChatMessage
from app.repositories.agents import AgentRepository
from app.repositories.analytics import AnalyticsRepository
from app.repositories.chat import ChatRepository
from app.schemas.agents import AgentOut, CreateSessionRequest, QuickActionRequest, SessionCreatedData
from app.schemas.chat import (
    ChatMessageOut,
    ChatRequest,
    ChatResponseData,
    ExtractedProfile,
    HandoffRequest,
    HandoffResponseData,
    NextAction,
    RecommendationPath,
    RecommendedSolution,
    SessionSnapshot,
    SuggestedQuestion,
)
from gff_ai.agents.handoff import build_handoff_payload
from gff_ai.graphs.discovery_graph import run_discovery_graph


class ChatService:
    def __init__(self, db: Session) -> None:
        self.db = db
        self.agents = AgentRepository(db)
        self.chat = ChatRepository(db)
        self.analytics = AnalyticsRepository(db)

    def _serialize_message(self, message: ChatMessage) -> ChatMessageOut:
        return ChatMessageOut.model_validate(message, from_attributes=True)

    def _capture_event(
        self,
        *,
        event_name: str,
        source: str,
        payload: dict[str, Any],
        session_id: str | None = None,
    ) -> None:
        self.analytics.create(
            session_id=session_id,
            event_name=event_name,
            source=source,
            payload=payload,
        )

    def create_session(self, payload: CreateSessionRequest) -> SessionCreatedData:
        selected_agent = None
        if payload.selected_agent_id:
            selected_agent = self.agents.get_by_id(payload.selected_agent_id)
            if not selected_agent:
                raise ApiException(status_code=404, code="agent_not_found", message="Agent not found.")

        session = self.chat.create_session(
            selected_agent_id=payload.selected_agent_id,
            session_state="welcome",
            source_surface=payload.source_surface,
        )
        self._capture_event(
            event_name="talk_to_agent_session_created",
            source=payload.source_surface,
            session_id=session.id,
            payload={
                "selected_agent_id": payload.selected_agent_id,
                "page_context": payload.page_context,
                "quick_action_id": payload.quick_action_id,
            },
        )
        self.db.commit()
        return SessionCreatedData(
            session_id=session.id,
            state="welcome",
            selected_agent=(
                AgentOut.model_validate(selected_agent, from_attributes=True) if selected_agent else None
            ),
            messages=[],
            quick_actions=[] if not selected_agent else selected_agent.quick_actions,
        )

    def get_session(self, session_id: str) -> SessionSnapshot:
        session = self.chat.get_session(session_id)
        if not session:
            raise ApiException(status_code=404, code="session_not_found", message="Session not found.")
        return SessionSnapshot(
            session_id=session.id,
            state=session.session_state,
            selected_agent_id=session.selected_agent_id,
            messages=[self._serialize_message(message) for message in session.messages],
            profile=ExtractedProfile(**session.profile_json) if session.profile_json else None,
            recommendation=session.recommendation_json or None,
            confidence_score=session.confidence_score,
        )

    def send_message(self, payload: ChatRequest) -> ChatResponseData:
        session = self.chat.get_session(payload.session_id)
        if not session:
            raise ApiException(status_code=404, code="session_not_found", message="Session not found.")

        selected_agent_id = payload.selected_agent_id or session.selected_agent_id
        if selected_agent_id and not self.agents.get_by_id(selected_agent_id):
            raise ApiException(status_code=404, code="agent_not_found", message="Agent not found.")

        self.chat.add_message(
            session_id=session.id,
            role="user",
            content=payload.message,
        )
        self._capture_event(
            event_name="talk_to_agent_message_sent",
            source=payload.source_surface,
            session_id=session.id,
            payload={"selected_agent_id": selected_agent_id, "message": payload.message},
        )

        graph_result = run_discovery_graph(
            session_id=session.id,
            latest_user_message=payload.message,
            selected_agent_id=selected_agent_id,
            messages=[{"role": message.role, "content": message.content} for message in session.messages]
            + [{"role": "user", "content": payload.message}],
        )

        structured_payload = {
            "state": graph_result.state,
            "route": graph_result.route,
            "extracted_profile": graph_result.extracted_profile.model_dump(),
            "recommended_paths": [item.model_dump() for item in graph_result.recommendations],
            "recommended_solutions": [item.model_dump() for item in graph_result.recommended_solutions],
            "suggested_questions": [item.model_dump() for item in graph_result.suggested_questions],
            "next_actions": [item.model_dump() for item in graph_result.next_actions],
            "candidate_routes": graph_result.candidate_routes,
        }
        self.chat.add_message(
            session_id=session.id,
            role="assistant",
            content=graph_result.specialist_response,
            structured_payload=structured_payload,
        )
        self.chat.update_session(
            session,
            selected_agent_id=graph_result.route,
            session_state=graph_result.state,
            profile_json=graph_result.extracted_profile.model_dump(),
            recommendation_json=structured_payload,
            confidence_score=graph_result.confidence_score,
        )

        self._capture_event(
            event_name="talk_to_agent_profile_extracted",
            source=payload.source_surface,
            session_id=session.id,
            payload=graph_result.extracted_profile.model_dump(),
        )
        self._capture_event(
            event_name="talk_to_agent_route_selected",
            source=payload.source_surface,
            session_id=session.id,
            payload={"route": graph_result.route, "confidence_score": graph_result.confidence_score},
        )
        self._capture_event(
            event_name="talk_to_agent_recommendation_shown",
            source=payload.source_surface,
            session_id=session.id,
            payload={"recommended_paths": graph_result.candidate_routes},
        )
        self.db.commit()

        return ChatResponseData(
            session_id=session.id,
            state=graph_result.state,
            assistant_message=graph_result.specialist_response,
            extracted_profile=ExtractedProfile(**graph_result.extracted_profile.model_dump()),
            confidence_score=graph_result.confidence_score,
            recommended_paths=[
                RecommendationPath(**item.model_dump()) for item in graph_result.recommendations
            ],
            recommended_solutions=[
                RecommendedSolution(**item.model_dump()) for item in graph_result.recommended_solutions
            ],
            suggested_questions=[
                SuggestedQuestion(**item.model_dump()) for item in graph_result.suggested_questions
            ],
            next_actions=[NextAction(**item.model_dump()) for item in graph_result.next_actions],
        )

    def trigger_quick_action(self, payload: QuickActionRequest) -> ChatResponseData:
        selected_agent = None
        if payload.selected_agent_id:
            selected_agent = self.agents.get_by_id(payload.selected_agent_id)
        session = self.chat.get_session(payload.session_id)
        if not session:
            raise ApiException(status_code=404, code="session_not_found", message="Session not found.")
        if not selected_agent and session.selected_agent_id:
            selected_agent = self.agents.get_by_id(session.selected_agent_id)
        if not selected_agent:
            raise ApiException(status_code=400, code="agent_required", message="Quick action requires a selected agent.")

        quick_action = next(
            (item for item in selected_agent.quick_actions if item["id"] == payload.quick_action_id),
            None,
        )
        if not quick_action:
            raise ApiException(status_code=404, code="quick_action_not_found", message="Quick action not found.")

        self._capture_event(
            event_name="talk_to_agent_quick_action_clicked",
            source=session.source_surface,
            session_id=session.id,
            payload={"selected_agent_id": selected_agent.id, "quick_action_id": payload.quick_action_id},
        )
        return self.send_message(
            ChatRequest(
                session_id=payload.session_id,
                message=quick_action["prompt"],
                selected_agent_id=selected_agent.id,
                source_surface=session.source_surface,
            )
        )

    def prepare_handoff(self, payload: HandoffRequest) -> HandoffResponseData:
        session = self.chat.get_session(payload.session_id)
        if not session:
            raise ApiException(status_code=404, code="session_not_found", message="Session not found.")

        route = payload.selected_agent_id or session.selected_agent_id or "strategy"
        profile = ExtractedProfile(**session.profile_json) if session.profile_json else ExtractedProfile()
        handoff_payload = build_handoff_payload(route=route, profile=profile, notes=payload.notes)
        self.chat.update_session(session, session_state="handoff_ready")
        self.chat.add_message(
            session_id=session.id,
            role="system",
            content=handoff_payload.summary,
            structured_payload=handoff_payload.model_dump(),
        )
        self._capture_event(
            event_name="talk_to_agent_handoff_requested",
            source=session.source_surface,
            session_id=session.id,
            payload=handoff_payload.model_dump(),
        )
        self.db.commit()
        return HandoffResponseData(
            session_id=session.id,
            state="handoff_ready",
            handoff_summary=handoff_payload.summary,
            payload=handoff_payload.model_dump(),
        )
