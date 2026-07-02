from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.schemas.blueprint import (
    BlueprintActionResponse,
    BlueprintGenerateRequest,
    BlueprintHandoffResponse,
    BlueprintOptionsData,
    BlueprintRegenerateRequest,
    BlueprintResultEnvelope,
)
from app.schemas.common import APIResponse
from app.services.blueprint_service import BlueprintService

router = APIRouter(prefix="/blueprint", tags=["blueprint"])


@router.get("/options", response_model=APIResponse[BlueprintOptionsData])
def list_options(db: Session = Depends(get_db)) -> APIResponse[BlueprintOptionsData]:
    data = BlueprintService(db).list_options()
    return APIResponse(success=True, data=data, error=None, meta={"source": "seeded-taxonomy"})


@router.post("/generate", response_model=APIResponse[BlueprintResultEnvelope])
def generate(payload: BlueprintGenerateRequest, db: Session = Depends(get_db)) -> APIResponse[BlueprintResultEnvelope]:
    data = BlueprintService(db).generate(payload)
    return APIResponse(success=True, data=data, error=None, meta={"version": data.version})


@router.get("/{blueprint_id}", response_model=APIResponse[BlueprintResultEnvelope])
def retrieve(blueprint_id: str, db: Session = Depends(get_db)) -> APIResponse[BlueprintResultEnvelope]:
    data = BlueprintService(db).retrieve(blueprint_id)
    return APIResponse(success=True, data=data, error=None)


@router.post("/{blueprint_id}/regenerate", response_model=APIResponse[BlueprintResultEnvelope])
def regenerate(
    blueprint_id: str,
    payload: BlueprintRegenerateRequest,
    db: Session = Depends(get_db),
) -> APIResponse[BlueprintResultEnvelope]:
    data = BlueprintService(db).regenerate(blueprint_id, payload)
    return APIResponse(success=True, data=data, error=None, meta={"regenerated_from": blueprint_id})


@router.post("/{blueprint_id}/export", response_model=APIResponse[BlueprintActionResponse])
def export_blueprint(blueprint_id: str, db: Session = Depends(get_db)) -> APIResponse[BlueprintActionResponse]:
    data = BlueprintService(db).export_placeholder(blueprint_id)
    return APIResponse(success=True, data=data, error=None)


@router.post("/{blueprint_id}/email", response_model=APIResponse[BlueprintActionResponse])
def email_blueprint(blueprint_id: str, db: Session = Depends(get_db)) -> APIResponse[BlueprintActionResponse]:
    data = BlueprintService(db).email_placeholder(blueprint_id)
    return APIResponse(success=True, data=data, error=None)


@router.post("/{blueprint_id}/handoff", response_model=APIResponse[BlueprintHandoffResponse])
def handoff_blueprint(blueprint_id: str, db: Session = Depends(get_db)) -> APIResponse[BlueprintHandoffResponse]:
    data = BlueprintService(db).handoff(blueprint_id)
    return APIResponse(success=True, data=data, error=None)
