from gff_ai.tools.scoring_tools import normalize_key


INDUSTRY_SLUG_MAP = {
    "banking": "banking-financial-services",
    "financial services": "banking-financial-services",
    "banking / financial services": "banking-financial-services",
    "insurance": "insurance",
    "healthcare": "healthcare",
    "life sciences": "healthcare",
    "manufacturing": "manufacturing",
    "retail": "retail",
    "education": "education",
    "government": "government",
    "mining": "mining",
    "energy": "energy",
    "telecom": "telecom",
    "audit": "audit",
    "tax": "tax",
    "legal": "legal",
    "other": "generic-enterprise",
    "generic enterprise": "generic-enterprise",
}


def normalize_industry_slug(industry: str, default_slug: str = "generic-enterprise") -> tuple[str, bool]:
    slug = INDUSTRY_SLUG_MAP.get(normalize_key(industry), default_slug)
    return slug, slug == default_slug and normalize_key(industry) not in INDUSTRY_SLUG_MAP


def select_industry_pack(
    *,
    industry: str,
    packs: list[dict],
    default_slug: str = "generic-enterprise",
) -> tuple[dict, list[str]]:
    slug, fell_back = normalize_industry_slug(industry, default_slug)
    pack_index = {pack["slug"]: pack for pack in packs if pack.get("slug")}
    selected = pack_index.get(slug) or pack_index.get(default_slug) or {}
    warnings: list[str] = []
    if fell_back:
        warnings.append(f"Unknown industry '{industry}' mapped to Generic Enterprise pack.")
    if not selected:
        warnings.append("Industry pack data was unavailable; deterministic generic defaults were used.")
    return selected, warnings
