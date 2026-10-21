"""
Email notifications via SMTP or Resend API.
Credentials come from environment variables only — never hardcoded.
"""
from __future__ import annotations

import logging
import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from typing import Optional

import httpx

from app.core.config import settings

logger = logging.getLogger(__name__)


async def send_contact_notification(
    sender_name: str,
    sender_email: str,
    message: str,
    contact_id: int,
) -> bool:
    """Send email notification when a contact message is received."""
    subject = f"[Portfolio] New message from {sender_name}"
    body_html = f"""
    <h2>New Contact Message</h2>
    <p><strong>From:</strong> {sender_name} ({sender_email})</p>
    <p><strong>Message ID:</strong> #{contact_id}</p>
    <hr>
    <p>{message.replace(chr(10), '<br>')}</p>
    <hr>
    <p><small>Reply to: {sender_email}</small></p>
    """

    # Try Resend first (simpler, free tier available)
    if settings.RESEND_API_KEY:
        return await _send_via_resend(subject, body_html, sender_email)

    # Fallback to SMTP
    if settings.SMTP_HOST and settings.SMTP_USER and settings.SMTP_PASSWORD:
        return _send_via_smtp(subject, body_html, sender_email)

    logger.warning("No email provider configured. Contact message stored in DB only.")
    return False


async def _send_via_resend(subject: str, html: str, reply_to: str) -> bool:
    try:
        async with httpx.AsyncClient(timeout=10) as client:
            resp = await client.post(
                "https://api.resend.com/emails",
                headers={"Authorization": f"Bearer {settings.RESEND_API_KEY}"},
                json={
                    "from": f"{settings.SMTP_FROM_NAME} <{settings.SMTP_FROM_EMAIL}>",
                    "to": [settings.CONTACT_NOTIFY_EMAIL],
                    "reply_to": reply_to,
                    "subject": subject,
                    "html": html,
                },
            )
            resp.raise_for_status()
            return True
    except Exception as exc:
        logger.error("Resend failed: %s", exc)
        return False


def _send_via_smtp(subject: str, html: str, reply_to: str) -> bool:
    try:
        msg = MIMEMultipart("alternative")
        msg["Subject"] = subject
        msg["From"] = f"{settings.SMTP_FROM_NAME} <{settings.SMTP_FROM_EMAIL}>"
        msg["To"] = settings.CONTACT_NOTIFY_EMAIL
        msg["Reply-To"] = reply_to
        msg.attach(MIMEText(html, "html"))

        with smtplib.SMTP(settings.SMTP_HOST, settings.SMTP_PORT) as server:
            server.ehlo()
            server.starttls()
            server.login(settings.SMTP_USER, settings.SMTP_PASSWORD)
            server.sendmail(
                settings.SMTP_FROM_EMAIL,
                settings.CONTACT_NOTIFY_EMAIL,
                msg.as_string(),
            )
        return True
    except Exception as exc:
        logger.error("SMTP failed: %s", exc)
        return False
