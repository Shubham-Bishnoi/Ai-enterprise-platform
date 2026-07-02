from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.schemas.common import APIResponse
from app.schemas.search import SearchIndexData, SearchIndexEntryOut, SearchResponse, SearchSuggestionResponse
from app.services.search_service import SearchService

router = APIRouter(prefix="/search", tags=["search"])


@router.get("", response_model=APIResponse[SearchResponse])
def search(q: str = Query(default=""), db: Session = Depends(get_db)) -> APIResponse[SearchResponse]:
    data = SearchService(db).search(q)
    return APIResponse(success=True, data=data, error=None)


@router.get("/suggestions", response_model=APIResponse[SearchSuggestionResponse])
def suggestions(q: str = Query(default=""), db: Session = Depends(get_db)) -> APIResponse[SearchSuggestionResponse]:
    data = SearchService(db).suggestions(q)
    return APIResponse(success=True, data=data, error=None)


@router.get("/index", response_model=APIResponse[SearchIndexData])
def index(db: Session = Depends(get_db)) -> APIResponse[SearchIndexData]:
    service = SearchService(db)
    featured_entries = service.repository.list_featured(limit=20)
    data = SearchIndexData(
        chips=service.chips(),
        featured=[SearchIndexEntryOut.model_validate(entry, from_attributes=True) for entry in featured_entries],
    )
    return APIResponse(success=True, data=data, error=None)
