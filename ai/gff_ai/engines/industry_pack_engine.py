from gff_ai.tools.industry_tools import select_industry_pack


def choose_industry_pack(*, industry: str, industry_packs: list[dict], default_slug: str = "generic-enterprise") -> tuple[dict, list[str]]:
    return select_industry_pack(
        industry=industry,
        packs=industry_packs,
        default_slug=default_slug,
    )
