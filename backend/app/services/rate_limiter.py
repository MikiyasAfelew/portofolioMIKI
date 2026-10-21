"""
Rate limiting — Redis when available, in-memory fallback for dev/tests.
OWASP API4: Lack of Resource & Rate Limiting — mitigated here.
"""
from __future__ import annotations

import time
from collections import defaultdict
from typing import Dict, Optional, Tuple

try:
    import redis.asyncio as aioredis
    REDIS_AVAILABLE = True
except ImportError:
    REDIS_AVAILABLE = False

from app.core.config import settings


# ── In-memory store (dev / test fallback) ─────────────────────────────────────
# { key: [(timestamp, count), ...] }
_memory_store: Dict[str, list] = defaultdict(list)


class RateLimiter:
    """
    Sliding-window rate limiter.
    Usage:
        limiter = RateLimiter()
        allowed, remaining = await limiter.check("contact:1.2.3.4", limit=3, window=3600)
    """

    def __init__(self) -> None:
        self._redis: Optional[aioredis.Redis] = None  # type: ignore[name-defined]

    async def _get_redis(self):
        if not REDIS_AVAILABLE or not settings.REDIS_URL:
            return None
        if self._redis is None:
            self._redis = aioredis.from_url(  # type: ignore[attr-defined]
                settings.REDIS_URL, decode_responses=True
            )
        return self._redis

    async def check(
        self, key: str, limit: int, window: int
    ) -> Tuple[bool, int]:
        """
        Returns (is_allowed, remaining_requests).
        window is in seconds.
        """
        # Import here to always read the live value (not a stale import-time copy)
        from app.core.config import settings as _s
        if _s.ENVIRONMENT == "testing":
            return True, limit

        redis = await self._get_redis()
        if redis:
            return await self._redis_check(redis, key, limit, window)
        return self._memory_check(key, limit, window)

    async def _redis_check(
        self, redis, key: str, limit: int, window: int
    ) -> Tuple[bool, int]:
        pipe = redis.pipeline()
        now = time.time()
        window_start = now - window
        full_key = f"rl:{key}"

        # Sliding window using sorted set
        pipe.zremrangebyscore(full_key, "-inf", window_start)
        pipe.zadd(full_key, {str(now): now})
        pipe.zcard(full_key)
        pipe.expire(full_key, window)
        results = await pipe.execute()
        count = results[2]
        remaining = max(0, limit - count)
        return count <= limit, remaining

    def _memory_check(
        self, key: str, limit: int, window: int
    ) -> Tuple[bool, int]:
        now = time.time()
        window_start = now - window
        # Clean old entries
        _memory_store[key] = [t for t in _memory_store[key] if t > window_start]
        _memory_store[key].append(now)
        count = len(_memory_store[key])
        remaining = max(0, limit - count)
        return count <= limit, remaining

    async def reset(self, key: str) -> None:
        redis = await self._get_redis()
        if redis:
            await redis.delete(f"rl:{key}")
        else:
            _memory_store.pop(key, None)


# Singleton
rate_limiter = RateLimiter()
