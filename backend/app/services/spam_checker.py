"""
Spam protection pipeline:
1. Honeypot field check (must be empty)
2. Basic content analysis (keyword scoring)
3. Optional Cloudflare Turnstile token verification
"""
from __future__ import annotations

import logging
import re
from typing import Optional

import httpx

from app.core.config import settings

logger = logging.getLogger(__name__)

SPAM_KEYWORDS = [
    "casino", "viagra", "crypto", "bitcoin", "forex",
    "click here", "free money", "make money fast", "buy now",
    "earn $", "winner", "congratulations", "prize",
]


def compute_spam_score(name: str, email: str, message: str) -> float:
    """
    Returns a score 0.0–1.0. Scores >= 0.7 are flagged as spam.
    Simple heuristics — replace with a real ML model if needed.
    """
    score = 0.0
    text = (name + " " + email + " " + message).lower()

    # Keyword check
    for kw in SPAM_KEYWORDS:
        if kw in text:
            score += 0.15

    # URL density (>3 URLs = suspicious)
    urls = re.findall(r"https?://", text)
    if len(urls) > 3:
        score += 0.3

    # All-caps message
    if message.upper() == message and len(message) > 20:
        score += 0.2

    # Repeated characters
    if re.search(r"(.)\1{4,}", message):
        score += 0.1

    return min(score, 1.0)


def check_honeypot(honeypot_value: str) -> bool:
    """Returns True if the message is likely from a bot."""
    return bool(honeypot_value.strip())


async def verify_turnstile(token: Optional[str], ip: str) -> bool:
    """
    Verify Cloudflare Turnstile token.
    Returns True if verification passes or if Turnstile is not configured.
    """
    if not settings.TURNSTILE_SECRET_KEY:
        return True  # Not configured — skip
    if not token:
        return False  # Configured but no token provided

    try:
        async with httpx.AsyncClient(timeout=5) as client:
            resp = await client.post(
                "https://challenges.cloudflare.com/turnstile/v0/siteverify",
                data={
                    "secret": settings.TURNSTILE_SECRET_KEY,
                    "response": token,
                    "remoteip": ip,
                },
            )
            data = resp.json()
            return data.get("success", False)
    except Exception as exc:
        logger.warning("Turnstile verification failed: %s", exc)
        return True  # Fail open (don't block legitimate users on network errors)
