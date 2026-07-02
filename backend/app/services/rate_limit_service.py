from __future__ import annotations

from dataclasses import dataclass


@dataclass
class RateLimitDecision:
    allowed: bool
    retry_after_seconds: int | None = None


class RateLimitService:
    def check(self, *, key: str, limit: int, window_seconds: int) -> RateLimitDecision:
        _ = (key, limit, window_seconds)
        return RateLimitDecision(allowed=True, retry_after_seconds=None)
