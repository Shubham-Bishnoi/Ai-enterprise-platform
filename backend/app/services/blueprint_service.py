from typing import Any

from sqlalchemy.orm import Session

from app.core.config import get_settings
from app.core.errors import ApiException
from app.repositories.analytics import AnalyticsRepository
from app.repositories.blueprint import BlueprintRepository
from app.repositories.industries import IndustryPackRepository
from app.repositories.use_cases import UseCaseRepository
from app.schemas.blueprint import (
    BlueprintActionResponse,
    BlueprintAdvancedOptions,
    BlueprintGenerateRequest,
    BlueprintHandoffResponse,
    BlueprintOptionItem,
    BlueprintOptionsData,
    BlueprintRegenerateRequest,
    BlueprintResultEnvelope,
)
from gff_ai.config import get_ai_settings
from gff_ai.graphs.blueprint_graph import run_blueprint_graph
from gff_ai.schemas.profile import BlueprintProfile


class BlueprintService:
    def __init__(self, db: Session) -> None:
        self.db = db
        self.settings = get_settings()
        self.ai_settings = get_ai_settings()
        self.analytics = AnalyticsRepository(db)
        self.blueprints = BlueprintRepository(db)
        self.industries = IndustryPackRepository(db)
        self.use_cases = UseCaseRepository(db)

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

    def _option_item(self, item) -> BlueprintOptionItem:
        return BlueprintOptionItem(
            label=item.label,
            value=item.value,
            description=item.description,
            metadata=item.metadata_json,
        )

    def list_options(self) -> BlueprintOptionsData:
        option_sets = self.blueprints.list_option_sets()
        grouped: dict[str, list[BlueprintOptionItem]] = {}
        for item in option_sets:
            grouped.setdefault(item.option_group, []).append(self._option_item(item))
        self._capture_event(
            event_name="blueprint_options_loaded",
            source="homepage_blueprint",
            payload={"option_groups": sorted(grouped.keys())},
        )
        self.db.commit()
        return BlueprintOptionsData(
            industries=grouped.get("industries", []),
            company_sizes=grouped.get("company_sizes", []),
            top_priorities=grouped.get("top_priorities", []),
            ai_journey_stages=grouped.get("ai_journey_stages", []),
            biggest_challenges=grouped.get("biggest_challenges", []),
            advanced_options=BlueprintAdvancedOptions(
                data_readiness=grouped.get("data_readiness", []),
                existing_systems=grouped.get("existing_systems", []),
                leadership_commitment=grouped.get("leadership_commitment", []),
                risk_appetite=grouped.get("risk_appetite", []),
            ),
        )

    def _to_profile(self, payload: BlueprintGenerateRequest, lead_id: str | None = None) -> BlueprintProfile:
        return BlueprintProfile(
            industry=payload.industry,
            company_size=payload.company_size,
            top_priorities=payload.top_priorities,
            ai_journey_stage=payload.ai_journey_stage,
            biggest_challenge=payload.biggest_challenge,
            email=str(payload.email),
            data_readiness=payload.data_readiness,
            existing_systems=payload.existing_systems,
            leadership_commitment=payload.leadership_commitment,
            risk_appetite=payload.risk_appetite,
            source=payload.source,
            chat_session_id=payload.chat_session_id,
            lead_id=lead_id,
        )

    def _serialize_result(self, result) -> BlueprintResultEnvelope:
        payload = dict(result.result_json)
        payload["created_at"] = result.created_at
        payload["version"] = result.version
        payload["ai_model"] = result.ai_model
        payload["provider"] = result.provider
        return BlueprintResultEnvelope.model_validate(payload)

    def _persist_blueprint(self, *, payload: BlueprintGenerateRequest, request_id: str | None = None) -> BlueprintResultEnvelope:
        source = payload.source or "homepage_blueprint"
        lead = self.blueprints.find_or_create_lead(email=str(payload.email), source=source)
        if request_id:
            request = self.blueprints.get_request(request_id)
            if not request:
                raise ApiException(status_code=404, code="blueprint_request_not_found", message="Blueprint request not found.")
            request.lead_id = lead.id
            request.chat_session_id = payload.chat_session_id
            request.industry = payload.industry
            request.company_size = payload.company_size
            request.top_priorities = payload.top_priorities
            request.ai_journey_stage = payload.ai_journey_stage
            request.biggest_challenge = payload.biggest_challenge
            request.email = str(payload.email)
            request.data_readiness = payload.data_readiness
            request.existing_systems = payload.existing_systems
            request.leadership_commitment = payload.leadership_commitment
            request.risk_appetite = payload.risk_appetite
            request.source = source
            request.raw_payload_json = payload.model_dump(mode="json")
            self.db.add(request)
            self.db.flush()
            self.db.refresh(request)
        else:
            request = self.blueprints.create_request(
                lead_id=lead.id,
                chat_session_id=payload.chat_session_id,
                industry=payload.industry,
                company_size=payload.company_size,
                top_priorities=payload.top_priorities,
                ai_journey_stage=payload.ai_journey_stage,
                biggest_challenge=payload.biggest_challenge,
                email=str(payload.email),
                data_readiness=payload.data_readiness,
                existing_systems=payload.existing_systems,
                leadership_commitment=payload.leadership_commitment,
                risk_appetite=payload.risk_appetite,
                source=source,
                raw_payload_json=payload.model_dump(mode="json"),
            )

        profile = self._to_profile(payload, lead.id)
        output = run_blueprint_graph(
            profile=profile,
            industry_packs=[
                {
                    "slug": pack.slug,
                    "name": pack.name,
                    "description": pack.description,
                    "common_challenges": pack.common_challenges,
                    "recommended_use_cases": pack.recommended_use_cases,
                    "architecture_hints": pack.architecture_hints,
                    "governance_priorities": pack.governance_priorities,
                    "recommended_agents": pack.recommended_agents,
                    "business_outcomes": pack.business_outcomes,
                    "roadmap_bias": pack.roadmap_bias_json or {},
                }
                for pack in self.industries.list_active()
            ],
            use_cases=[
                {
                    "slug": item.slug,
                    "title": item.title,
                    "description": item.description,
                    "industry_slug": item.industry_slug,
                    "capability_slug": item.capability_slug,
                    "impact_level": item.impact_level,
                    "complexity": item.complexity,
                    "time_to_value": item.time_to_value,
                    "recommended_agent": item.recommended_agent,
                    "tags": item.tags,
                    "status": item.status,
                }
                for item in self.use_cases.list_active()
            ],
            request_id=request.id,
            default_industry_slug=self.settings.blueprint_default_industry,
        )
        persisted = self.blueprints.create_result(
            request_id=request.id,
            readiness_score=output.readiness_score,
            readiness_category=output.readiness_category,
            readiness_breakdown_json=output.readiness_breakdown.model_dump(),
            result_json=output.model_dump(mode="json"),
            version=self.settings.blueprint_engine_version,
            ai_model=(
                self.ai_settings.openai_model
                if self.ai_settings.ai_provider.lower() == "openai"
                else self.ai_settings.nvidia_model
            ),
            provider=self.ai_settings.ai_provider,
            confidence_score=output.confidence_score,
            assumptions=output.assumptions,
            warnings=output.warnings,
        )
        payload_data = output.model_copy(update={"id": persisted.id, "request_id": request.id})
        persisted.result_json = payload_data.model_dump(mode="json")
        self.db.add(persisted)
        self.db.flush()
        self.db.refresh(persisted)
        self.db.commit()
        return self._serialize_result(persisted)

    def generate(self, payload: BlueprintGenerateRequest) -> BlueprintResultEnvelope:
        self._capture_event(
            event_name="blueprint_generate_started",
            source=payload.source,
            session_id=payload.chat_session_id,
            payload=payload.model_dump(mode="json"),
        )
        try:
            result = self._persist_blueprint(payload=payload)
        except Exception as exc:
            self.db.rollback()
            self._capture_event(
                event_name="blueprint_generate_failed",
                source=payload.source,
                session_id=payload.chat_session_id,
                payload={"reason": str(exc)},
            )
            self.db.commit()
            if isinstance(exc, ApiException):
                raise
            raise ApiException(
                status_code=500,
                code="blueprint_generate_failed",
                message="Blueprint generation failed.",
                details={"reason": str(exc)},
            ) from exc
        self._capture_event(
            event_name="blueprint_generate_completed",
            source=payload.source,
            session_id=payload.chat_session_id,
            payload={"blueprint_id": result.id, "request_id": result.request_id, "score": result.readiness_score},
        )
        self.db.commit()
        return result

    def retrieve(self, blueprint_id: str) -> BlueprintResultEnvelope:
        result = self.blueprints.get_result(blueprint_id)
        if not result:
            raise ApiException(status_code=404, code="blueprint_not_found", message="Blueprint not found.")
        payload = self._serialize_result(result)
        self._capture_event(
            event_name="blueprint_retrieved",
            source=payload.input_profile.source,
            session_id=payload.input_profile.chat_session_id,
            payload={"blueprint_id": blueprint_id, "request_id": payload.request_id},
        )
        self.db.commit()
        return payload

    def regenerate(self, blueprint_id: str, payload: BlueprintRegenerateRequest) -> BlueprintResultEnvelope:
        existing = self.blueprints.get_result(blueprint_id)
        if not existing:
            raise ApiException(status_code=404, code="blueprint_not_found", message="Blueprint not found.")
        request = self.blueprints.get_request(existing.request_id)
        if not request:
            raise ApiException(status_code=404, code="blueprint_request_not_found", message="Blueprint request not found.")
        merged = dict(request.raw_payload_json)
        merged.update(payload.overrides)
        validated = BlueprintGenerateRequest.model_validate(merged)
        self._capture_event(
            event_name="blueprint_regenerate_requested",
            source=validated.source,
            session_id=validated.chat_session_id,
            payload={"blueprint_id": blueprint_id, "overrides": payload.overrides},
        )
        self.db.commit()
        return self._persist_blueprint(payload=validated, request_id=request.id)

    def export_placeholder(self, blueprint_id: str) -> BlueprintActionResponse:
        blueprint = self.retrieve(blueprint_id)
        self._capture_event(
            event_name="blueprint_export_requested",
            source=blueprint.input_profile.source,
            session_id=blueprint.input_profile.chat_session_id,
            payload={"blueprint_id": blueprint_id},
        )
        self.db.commit()
        return BlueprintActionResponse(
            blueprint_id=blueprint_id,
            action="export",
            status="placeholder",
            message="PDF export is reserved for Phase 1.5 frontend integration.",
        )

    def email_placeholder(self, blueprint_id: str) -> BlueprintActionResponse:
        blueprint = self.retrieve(blueprint_id)
        self._capture_event(
            event_name="blueprint_email_requested",
            source=blueprint.input_profile.source,
            session_id=blueprint.input_profile.chat_session_id,
            payload={"blueprint_id": blueprint_id, "email": blueprint.input_profile.email},
        )
        self.db.commit()
        return BlueprintActionResponse(
            blueprint_id=blueprint_id,
            action="email",
            status="placeholder",
            message="Blueprint email delivery is reserved for Phase 1.5 frontend integration.",
        )

    def handoff(self, blueprint_id: str) -> BlueprintHandoffResponse:
        blueprint = self.retrieve(blueprint_id)
        self._capture_event(
            event_name="blueprint_handoff_requested",
            source=blueprint.input_profile.source,
            session_id=blueprint.input_profile.chat_session_id,
            payload={"blueprint_id": blueprint_id},
        )
        self.db.commit()
        return BlueprintHandoffResponse(
            blueprint_id=blueprint_id,
            handoff_summary=blueprint.handoff_summary.model_dump(),
        )
