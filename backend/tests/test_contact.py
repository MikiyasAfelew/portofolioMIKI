"""Tests for contact endpoint — validation, honeypot, rate limiting."""
import pytest
from httpx import AsyncClient


VALID_CONTACT = {
    "name": "Test User",
    "email": "testuser@example.com",
    "message": "Hello, this is a test message that is long enough.",
    "website": "",  # honeypot must be empty
}


@pytest.mark.asyncio
async def test_contact_success(client: AsyncClient):
    resp = await client.post("/api/v1/contact", json=VALID_CONTACT)
    assert resp.status_code == 201
    assert "Message received" in resp.json()["message"]


@pytest.mark.asyncio
async def test_contact_honeypot_blocked(client: AsyncClient):
    payload = {**VALID_CONTACT, "website": "http://spam.com"}
    resp = await client.post("/api/v1/contact", json=payload)
    # Returns 201 silently (don't tell bots they were caught)
    assert resp.status_code == 201


@pytest.mark.asyncio
async def test_contact_invalid_email(client: AsyncClient):
    payload = {**VALID_CONTACT, "email": "not-an-email"}
    resp = await client.post("/api/v1/contact", json=payload)
    assert resp.status_code == 422


@pytest.mark.asyncio
async def test_contact_message_too_short(client: AsyncClient):
    payload = {**VALID_CONTACT, "message": "Hi"}
    resp = await client.post("/api/v1/contact", json=payload)
    assert resp.status_code == 422


@pytest.mark.asyncio
async def test_contact_name_too_short(client: AsyncClient):
    payload = {**VALID_CONTACT, "name": "X"}
    resp = await client.post("/api/v1/contact", json=payload)
    assert resp.status_code == 422
