"""In-memory sliding-window rate limiter.

Suits the current single-instance Render deployment; the keys are salted
hashes (never raw IPs) and live only in process memory, so nothing here is
persisted or personally identifying. If the backend ever scales past one
instance, swap the store for Redis behind the same interface.
"""

from __future__ import annotations

import threading
import time
from collections import deque
from dataclasses import dataclass

_MAX_TRACKED_KEYS = 10_000


@dataclass
class RateLimitDecision:
    allowed: bool
    retry_after_seconds: int | None = None


class RateLimitService:
    _lock = threading.Lock()
    _hits: dict[str, deque[float]] = {}

    def check(self, *, key: str, limit: int, window_seconds: int) -> RateLimitDecision:
        now = time.monotonic()
        cutoff = now - window_seconds
        with self._lock:
            if key not in self._hits and len(self._hits) >= _MAX_TRACKED_KEYS:
                # Memory guard: drop everything rather than grow unbounded.
                self._hits.clear()
            bucket = self._hits.setdefault(key, deque())
            while bucket and bucket[0] <= cutoff:
                bucket.popleft()
            if len(bucket) >= limit:
                retry_after = max(1, int(bucket[0] + window_seconds - now) + 1)
                return RateLimitDecision(allowed=False, retry_after_seconds=retry_after)
            bucket.append(now)
            return RateLimitDecision(allowed=True, retry_after_seconds=None)

    @classmethod
    def reset(cls) -> None:
        """Test helper: clear all tracked windows."""
        with cls._lock:
            cls._hits.clear()
