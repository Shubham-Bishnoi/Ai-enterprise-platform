from sqlalchemy.orm import Session

from app.core.errors import ApiException
from app.repositories.content import ContentRepository
from app.schemas.content import ContentPageOut, HomeSectionOut, SiteFooterData, SiteNavigationData


class ContentService:
    def __init__(self, db: Session) -> None:
        self.db = db
        self.repository = ContentRepository(db)

    def navigation(self) -> SiteNavigationData:
        page = self.repository.get_page_by_slug("navigation")
        items = []
        if page and isinstance(page.content_json, dict):
            items = list(page.content_json.get("items", []) or [])
        return SiteNavigationData(items=items)

    def footer(self) -> SiteFooterData:
        page = self.repository.get_page_by_slug("footer")
        columns = []
        if page and isinstance(page.content_json, dict):
            columns = list(page.content_json.get("columns", []) or [])
        return SiteFooterData(columns=columns)

    def home(self) -> dict:
        page = self.repository.get_page_by_slug("home")
        if not page:
            return {}
        return page.content_json or {}

    def list_home_sections(self) -> list[HomeSectionOut]:
        return [HomeSectionOut.model_validate(section, from_attributes=True) for section in self.repository.list_sections()]

    def get_home_section(self, section_key: str) -> HomeSectionOut:
        section = self.repository.get_section_by_key(section_key)
        if not section:
            raise ApiException(code="not_found", message="Home section not found.", status_code=404)
        return HomeSectionOut.model_validate(section, from_attributes=True)

    def get_page(self, slug: str) -> ContentPageOut:
        page = self.repository.get_page_by_slug(slug)
        if not page or page.status != "published":
            raise ApiException(code="not_found", message="Content page not found.", status_code=404)
        return ContentPageOut.model_validate(page, from_attributes=True)
