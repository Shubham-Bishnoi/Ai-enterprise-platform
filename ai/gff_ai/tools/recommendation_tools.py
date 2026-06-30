from gff_ai.engines.recommendation_engine import build_recommendations


def build_route_recommendations(route: str, confidence_score: float, profile, candidate_routes):
    return build_recommendations(
        route=route,
        confidence_score=confidence_score,
        profile=profile,
        candidate_routes=candidate_routes,
    )
