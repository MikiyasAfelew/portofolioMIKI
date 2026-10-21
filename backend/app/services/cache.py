"""
Simple cache with Redis / in-memory fallback.
Public GET endpoints use this for ETags and response caching.
"""
from __future__ import annotations

import hashlib
import json
import time
from typing import Any, Dict, Optional

try:
    import redis.asyncio as aioredis
    REDIS_AVAILABLE = True
except ImportError:
    REDIS_AVAILABLE = False

from app.core.config import settings

_mem: Dict[str, tuple] = {}   # key -> (value, expires_at)


class Cache:
    def __init__(self) -> None:
        self._redis = None

    async def _r(self):
        if not REDIS_AVAILABLE or not settings.REDIS_URL:
            return None
        if not self._redis:
            self._redis = aioredis.from_url(settings.REDIS_URL, decode_responses=True)
        return self._redis

    async def get(self, key: str) -> Optional[Any]:
        r = await self._r()
        if r:
            val = await r.get(f"cache:{key}")
            return json.loads(val) if val else None
        entry = _mem.get(key)
        if entry and entry[1] > time.time():
            return entry[0]
        return None

    async def set(self, key: str, value: Any, ttl: int = 300) -> None:
        r = await self._r()
        if r:
            await r.setex(f"cache:{key}", ttl, json.dumps(value, default=str))
        else:
            _mem[key] = (value, time.time() + ttl)

    async def delete(self, key: str) -> None:
        r = await self._r()
        if r:
            await r.delete(f"cache:{key}")
        else:
            _mem.pop(key, None)

    async def delete_pattern(self, pattern: str) -> None:
        """Invalidate all cache keys matching a prefix."""
        r = await self._r()
        if r:
            keys = await r.keys(f"cache:{pattern}*")
            if keys:
                await r.delete(*keys)
        else:
            to_del = [k for k in _mem if k.startswith(pattern)]
            for k in to_del:
                _mem.pop(k, None)


def make_etag(data: Any) -> str:
    """Generate ETag from response data."""
    payload = json.dumps(data, default=str, sort_keys=True)
    return hashlib.md5(payload.encode()).hexdigest()


cache = Cache()
