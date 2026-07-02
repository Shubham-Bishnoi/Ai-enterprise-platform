from sqlalchemy.orm import Session

from app.core.errors import ApiException
from app.repositories.industries import IndustryRepository
from app.schemas.industries import IndustryOut


class IndustryService:
    def __init__(self, db: Session) -> None:
        self.db = db
        self.repository = IndustryRepository(db)

    def list_industries(self) -> list[IndustryOut]:
        results: list[IndustryOut] = []
        for pack in self.repository.list_packs():
            content = self.repository.get_content_for_pack(pack.slug)
            ui = {}
            if content:
                ui = {
                    "slug": content.slug,
                    "icon": content.ui_icon,
                    "color": content.ui_color,
                    "challenges": content.challenges,
                    "outcomes": content.outcomes,
                }
            results.append(
                IndustryOut(
                    slug=pack.slug,
                    name=pack.name,
                    description=pack.description,
                    common_challenges=list(pack.common_challenges or []),
                    business_outcomes=list(pack.business_outcomes or []),
                    recommended_use_cases=list(pack.recommended_use_cases or []),
                    recommended_agents=list(pack.recommended_agents or []),
                    architecture_hints=list(pack.architecture_hints or []),
                    governance_priorities=list(pack.governance_priorities or []),
                    roadmap_bias=pack.roadmap_bias_json,
                    ui=ui,
                    created_at=pack.created_at,
                )
            )
        return results

    def get_industry(self, slug: str) -> IndustryOut:
        pack = self.repository.get_pack_by_slug(slug)
        if not pack or pack.status != "active":
            raise ApiException(code="not_found", message="Industry not found.", status_code=404)
        content = self.repository.get_content_for_pack(pack.slug)
        ui = {}
        if content:
            ui = {
                "slug": content.slug,
                "icon": content.ui_icon,
                "color": content.ui_color,
                "challenges": content.challenges,
                "outcomes": content.outcomes,
            }
        return IndustryOut(
            slug=pack.slug,
            name=pack.name,
            description=pack.description,
            common_challenges=list(pack.common_challenges or []),
            business_outcomes=list(pack.business_outcomes or []),
            recommended_use_cases=list(pack.recommended_use_cases or []),
            recommended_agents=list(pack.recommended_agents or []),
            architecture_hints=list(pack.architecture_hints or []),
            governance_priorities=list(pack.governance_priorities or []),
            roadmap_bias=pack.roadmap_bias_json,
            ui=ui,
            created_at=pack.created_at,
        )

    def industry_use_cases(self, slug: str) -> list:
        pack = self.repository.get_pack_by_slug(slug)
        if not pack or pack.status != "active":
            raise ApiException(code="not_found", message="Industry not found.", status_code=404)
        return list(pack.recommended_use_cases or [])

    def industry_agents(self, slug: str) -> list:
        pack = self.repository.get_pack_by_slug(slug)
        if not pack or pack.status != "active":
            raise ApiException(code="not_found", message="Industry not found.", status_code=404)
        return list(pack.recommended_agents or [])

    def industry_reference_architecture(self, slug: str) -> dict:
        pack = self.repository.get_pack_by_slug(slug)
        if not pack or pack.status != "active":
            raise ApiException(code="not_found", message="Industry not found.", status_code=404)
        return {
            "architecture_hints": list(pack.architecture_hints or []),
            "governance_priorities": list(pack.governance_priorities or []),
            "roadmap_bias": pack.roadmap_bias_json or {},
        }
