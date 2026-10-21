# Mikiyas Afelew — Portfolio API

A **production-ready**, **secure** FastAPI backend for the portfolio website.
Demonstrates real DevSecOps practices: JWT auth with rotation, OWASP Top 10 mitigations,
Docker multi-stage builds, CI/CD with security scanning, and more.

---

## Architecture Overview

```
backend/
├── app/
│   ├── api/
│   │   ├── deps.py              # JWT auth dependency, IP extraction
│   │   └── v1/
│   │       ├── auth.py          # Login, refresh, logout
│   │       ├── public.py        # Public GET endpoints (cached)
│   │       ├── contact.py       # Contact form (rate-limited, spam-protected)
│   │       └── admin.py         # Full CRUD + upload + GitHub sync
│   ├── core/
│   │   ├── config.py            # All settings via env vars (pydantic-settings)
│   │   └── security.py          # Argon2 hashing, JWT, IP hashing
│   ├── db/
│   │   └── base.py              # Async SQLAlchemy engine + session
│   ├── models/                  # ORM models (SQLAlchemy 2.0)
│   ├── schemas/                 # Pydantic v2 request/response schemas
│   ├── services/
│   │   ├── rate_limiter.py      # Sliding window (Redis / in-memory)
│   │   ├── cache.py             # Response cache + ETags
│   │   ├── email_service.py     # Resend / SMTP notifications
│   │   ├── spam_checker.py      # Honeypot, scoring, Turnstile
│   │   └── github_sync.py       # GitHub API sync
│   └── main.py                  # App factory, middleware, routes
├── alembic/                     # Database migrations
├── scripts/
│   └── seed.py                  # Real data seed
├── tests/                       # pytest async test suite
├── Dockerfile                   # Multi-stage, non-root
├── docker-compose.yml           # App + PostgreSQL + Redis
├── requirements.txt             # Pinned dependencies
├── pyproject.toml               # Ruff + Black + pytest config
└── SECURITY.md                  # OWASP mitigations documented
```

---

## Quick Start (Local Development)

### 1. Prerequisites
- Python 3.12+
- (Optional) Docker & Docker Compose

### 2. Setup

```bash
cd backend

# Create virtual environment
python -m venv .venv
# Windows:
.venv\Scripts\activate
# Linux/Mac:
source .venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Copy env file and fill in values
cp .env.example .env
# Edit .env — at minimum set SECRET_KEY and ADMIN_PASSWORD
```

### 3. Generate a strong SECRET_KEY

```bash
python -c "import secrets; print(secrets.token_urlsafe(64))"
```
Paste the output into `.env` as `SECRET_KEY`.

### 4. Run migrations

```bash
# SQLite (default for local dev — no Postgres needed)
alembic upgrade head
```

### 5. Seed the database

```bash
python -m scripts.seed
```

### 6. Start the server

```bash
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

Visit **http://localhost:8000/docs** for interactive API documentation.

---

## Docker (Recommended for Production)

```bash
cd backend

# Copy and configure env
cp .env.example .env
# Set: SECRET_KEY, POSTGRES_PASSWORD, ADMIN_PASSWORD, ALLOWED_ORIGINS

# Start all services
docker compose up -d

# Run migrations inside container
docker compose exec api alembic upgrade head

# Seed data
docker compose exec api python -m scripts.seed

# View logs
docker compose logs -f api
```

---

## Environment Variables

| Variable | Required | Description |
|---|---|---|
| `SECRET_KEY` | ✅ | 64-char random string for JWT signing |
| `DATABASE_URL` | ✅ | SQLAlchemy async DB URL |
| `ADMIN_EMAIL` | ✅ | Admin login email |
| `ADMIN_PASSWORD` | ✅ | Admin password (hashed on seed) |
| `ALLOWED_ORIGINS` | ✅ | Comma-separated CORS origins |
| `ENVIRONMENT` | ✅ | `development` / `production` / `testing` |
| `REDIS_URL` | ⬜ | Redis URL (in-memory fallback if not set) |
| `RESEND_API_KEY` | ⬜ | Resend API key for email notifications |
| `GITHUB_TOKEN` | ⬜ | GitHub PAT for repo sync |
| `TURNSTILE_SECRET_KEY` | ⬜ | Cloudflare Turnstile secret |
| `POSTGRES_PASSWORD` | Docker | PostgreSQL password for docker-compose |

---

## API Reference

### Public Endpoints (no auth required)

| Method | Path | Description |
|---|---|---|
| `GET` | `/api/v1/health` | Health check |
| `GET` | `/api/v1/profile` | Get profile + social links |
| `GET` | `/api/v1/projects` | List projects (pagination, filter, search) |
| `GET` | `/api/v1/projects/{slug}` | Get single project |
| `GET` | `/api/v1/skills` | List all skills |
| `GET` | `/api/v1/education` | List education + certifications |
| `GET` | `/api/v1/experience` | List experience |
| `GET` | `/api/v1/services` | List services |
| `POST` | `/api/v1/contact` | Submit contact message |

### Auth Endpoints

| Method | Path | Description |
|---|---|---|
| `POST` | `/api/v1/auth/login` | Login → access + refresh tokens |
| `POST` | `/api/v1/auth/refresh` | Rotate refresh token |
| `POST` | `/api/v1/auth/logout` | Revoke refresh token |

### Admin Endpoints (Bearer token required)

| Method | Path | Description |
|---|---|---|
| `PUT` | `/api/v1/admin/profile` | Update profile |
| `POST/PUT/DELETE` | `/api/v1/admin/projects` | CRUD projects |
| `POST/PUT/DELETE` | `/api/v1/admin/skills` | CRUD skills |
| `POST/PUT/DELETE` | `/api/v1/admin/education` | CRUD education |
| `POST/PUT/DELETE` | `/api/v1/admin/experience` | CRUD experience |
| `POST/PUT/DELETE` | `/api/v1/admin/services` | CRUD services |
| `GET` | `/api/v1/admin/messages` | List contact messages |
| `PATCH` | `/api/v1/admin/messages/{id}/read` | Mark as read |
| `DELETE` | `/api/v1/admin/messages/{id}` | Delete message |
| `POST` | `/api/v1/admin/upload` | Upload image/PDF |
| `POST` | `/api/v1/admin/github/sync` | Sync GitHub repos |
| `GET` | `/api/v1/admin/github/repos` | List cached repos |
| `PATCH` | `/api/v1/admin/github/repos/{id}/visibility` | Toggle show on site |

---

## Connecting the Frontend

### Install in your React project (no extra packages needed — use native fetch)

```typescript
// src/lib/api.ts

const API_BASE = import.meta.env.VITE_API_URL ?? "http://localhost:8000/api/v1";

// ── Public fetch helpers ────────────────────────────────────────────────────
export async function getProfile() {
  const res = await fetch(`${API_BASE}/profile`);
  if (!res.ok) throw new Error("Failed to load profile");
  return res.json();
}

export async function getProjects(params?: {
  page?: number;
  size?: number;
  category?: string;
  search?: string;
  featured?: boolean;
}) {
  const url = new URL(`${API_BASE}/projects`);
  if (params) {
    Object.entries(params).forEach(([k, v]) => {
      if (v !== undefined) url.searchParams.set(k, String(v));
    });
  }
  const res = await fetch(url.toString());
  if (!res.ok) throw new Error("Failed to load projects");
  return res.json(); // { items, total, page, size, pages }
}

export async function submitContact(data: {
  name: string;
  email: string;
  message: string;
  website?: string; // honeypot — leave empty
  cf_turnstile_token?: string;
}) {
  const res = await fetch(`${API_BASE}/contact`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ...data, website: "" }),
  });
  if (res.status === 429) throw new Error("Too many messages. Please wait.");
  if (!res.ok) throw new Error("Failed to send message");
  return res.json();
}

// ── Admin helpers ────────────────────────────────────────────────────────────
export async function adminLogin(email: string, password: string) {
  const res = await fetch(`${API_BASE}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  if (!res.ok) throw new Error("Invalid credentials");
  return res.json(); // { access_token, refresh_token, expires_in }
}
```

### Add to your `.env` (Vite frontend)

```env
VITE_API_URL=https://your-api.onrender.com/api/v1
```

### Example React hook

```typescript
// src/hooks/useProfile.ts
import { useEffect, useState } from "react";
import { getProfile } from "../lib/api";

export function useProfile() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getProfile()
      .then(setProfile)
      .finally(() => setLoading(false));
  }, []);

  return { profile, loading };
}
```

---

## Running Tests

```bash
cd backend

# Run all tests
pytest

# With verbose output
pytest -v

# Single file
pytest tests/test_auth.py -v

# Coverage report
pytest --cov=app --cov-report=html
# Open htmlcov/index.html in browser
```

---

## Deployment Guide

### Option A — Render (Recommended — Free tier available)

1. Push code to GitHub
2. Go to [render.com](https://render.com) → New Web Service
3. Connect your GitHub repo, set **Root Directory** to `backend`
4. Set **Build Command**: `pip install -r requirements.txt && alembic upgrade head`
5. Set **Start Command**: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
6. Add all environment variables from `.env.example`
7. Add a **PostgreSQL** database (Render free tier or [neon.tech](https://neon.tech))
8. Set `DATABASE_URL` to the Postgres connection string
9. Set `ENVIRONMENT=production`
10. Copy the **Deploy Hook URL** → add to GitHub secret `RENDER_DEPLOY_HOOK_URL`

### Option B — Railway

```bash
# Install Railway CLI
npm install -g @railway/cli
railway login
railway init
railway add postgresql redis
railway up
```

### Option C — Fly.io

```bash
cd backend
fly launch --no-deploy
fly secrets set SECRET_KEY="..." ADMIN_PASSWORD="..."
fly deploy
```

### Database Migrations on Deploy

Always run migrations before starting the app. For Render, add to Build Command:
```
pip install -r requirements.txt && alembic upgrade head
```

### Automated Backups (PostgreSQL)

```bash
# Daily backup script (add to cron or Render cron job)
pg_dump $DATABASE_URL | gzip > backup_$(date +%Y%m%d).sql.gz
```
For managed databases (Neon, Supabase, Render), enable automatic backups in the dashboard.

---

## What You Still Need to Fill In

| Item | Where | Status |
|---|---|---|
| `SECRET_KEY` | `.env` | 🔴 Generate and set before any deployment |
| `ADMIN_PASSWORD` | `.env` | 🔴 Set a strong password, then run seed |
| Internship role & company | `scripts/seed.py` lines ~115-116 | 🟡 Fill when ready |
| Internship start date | `scripts/seed.py` line ~117 | 🟡 Fill when ready |
| CV URL | `scripts/seed.py` line ~69 | 🟡 Upload CV and add URL |
| `ALLOWED_ORIGINS` | `.env` | 🟡 Set your production frontend URL |
| `RESEND_API_KEY` or SMTP | `.env` | 🟡 For email notifications |
| `GITHUB_TOKEN` | `.env` | 🟡 For GitHub repo sync |
| `RENDER_DEPLOY_HOOK_URL` | GitHub Secrets | 🟡 For auto-deploy CI/CD |
| `TURNSTILE_SECRET_KEY` | `.env` | ⬜ Optional spam protection |
| EsayaRent description | `scripts/seed.py` | ⬜ Add when repo has more details |
| Custom domain | Render/Fly dashboard | ⬜ Optional |

---

## Security Checklist

- [ ] `SECRET_KEY` is a unique 64-char random string (not the example value)
- [ ] `ADMIN_PASSWORD` is strong (12+ chars, mixed case, numbers, symbols)
- [ ] `.env` is in `.gitignore` and never committed
- [ ] `ENVIRONMENT=production` in production
- [ ] `ALLOWED_ORIGINS` only contains your actual frontend domain
- [ ] Swagger docs are disabled (`/docs` returns 404 in production)
- [ ] HTTPS is enforced (Render/Fly handles this automatically)
- [ ] Dependabot is enabled on the repo
- [ ] Database has a least-privilege user (not superuser)
- [ ] Backups are configured for the production database
