"""
Contact endpoint — rate-limited, spam-protected, sends email notification.
OWASP API4 (rate limiting) + API8 (injection via Pydantic validation).
"""
from __future__ import annotations

from fastapi import APIRouter, Depends, HTTPException, Request, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.deps import get_client_ip
from app.core.config import settings
from app.core.security import hash_ip
from app.db.base import get_db
from app.models.contact import ContactMessage
from app.schemas.contact import ContactCreate, ContactMessageSuccess
from app.services.email_service import send_contact_notification
from app.services.rate_limiter import rate_limiter
from app.services.spam_checker import (
    check_honeypot,
    compute_spam_score,
    verify_turnstile,
)

router = APIRouter(tags=["contact"])


@router.post(
    "/contact",
    response_model=ContactMessageSuccess,
    status_code=status.HTTP_201_CREATED,
)
async def submit_contact(
    body: ContactCreate,
    request: Request,
    db: AsyncSession = Depends(get_db),
) -> ContactMessageSuccess:
    ip = get_client_ip(request)

    # 1. Honeypot check — bots fill the hidden 'website' field
    if check_honeypot(body.website):
        # Return success silently — don't tell bots they were caught
        return ContactMessageSuccess()

    # 2. Rate limit: 3 messages per IP per hour
    allowed, remaining = await rate_limiter.check(
        f"contact:{ip}",
        limit=settings.RATE_LIMIT_CONTACT_PER_HOUR,
        window=3600,
    )
    if not allowed:
        raise HTTPException(
            status_code=status.HTTP_429_TOO_MANY_REQUESTS,
            detail="Too many messages. Please wait before sending again.",
            headers={"Retry-After": "3600"},
        )

    # 3. Cloudflare Turnstile verification (if configured)
    turnstile_ok = await verify_turnstile(body.cf_turnstile_token, ip)
    if not turnstile_ok:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Security verification failed. Please try again.",
        )

    # 4. Spam scoring
    spam_score = compute_spam_score(body.name, body.email, body.message)
    is_spam = spam_score >= 0.7

    # 5. Store in DB (even spam — admin can review)
    msg = ContactMessage(
        name=body.name,
        email=body.email,
        message=body.message,
        ip_hash=hash_ip(ip),
        spam_score=spam_score,
        is_spam=is_spam,
    )
    db.add(msg)
    await db.flush()  # get the ID before committing

    # 6. Send email notification (only for non-spam)
    if not is_spam:
        await send_contact_notification(
            sender_name=body.name,
            sender_email=body.email,
            message=body.message,
            contact_id=msg.id,
        )

    await db.commit()
    return ContactMessageSuccess()
