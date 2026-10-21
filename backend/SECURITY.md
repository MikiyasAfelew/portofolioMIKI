# Security Policy

## Supported Versions

| Version | Supported |
|---------|-----------|
| 1.x     | ✅        |

## Reporting a Vulnerability

If you discover a security vulnerability, **do not open a public GitHub issue**.

Please email **heri21miki@gmail.com** with:
- Description of the vulnerability
- Steps to reproduce
- Potential impact

I will respond within 48 hours and work on a fix promptly.

---

## OWASP API Security Top 10 — How This API Addresses Each Risk

### API1: Broken Object Level Authorization
- Every admin route verifies JWT ownership
- Public routes only return non-sensitive data
- No user-supplied IDs can access other users' data (single admin model)

### API2: Broken Authentication
- Argon2 password hashing (memory-hard, resistant to GPU attacks)
- Short-lived access tokens (15 minutes)
- Refresh token rotation — each refresh issues a new token and revokes the old
- Token theft detection — using a revoked refresh token invalidates ALL tokens for that user
- Brute-force lockout after 10 failed attempts (15-minute lockout)
- Rate limiting on `/auth/login` (5 attempts/minute per IP)

### API3: Broken Object Property Level Authorization
- Pydantic schemas strictly define what fields are returned per endpoint
- Admin-only fields (ip_hash, spam_score) never appear in public responses
- `exclude_unset=True` on all PATCH operations prevents mass assignment

### API4: Lack of Resource & Rate Limiting
- Contact form: 3 messages per IP per hour
- Login: 5 attempts per minute per IP
- File upload: 5 MB limit with chunk-reading (no memory exhaustion)
- Pagination enforced on all list endpoints (max 50/100 items)

### API5: Broken Function Level Authorization
- Admin routes live under `/api/v1/admin/` prefix — all require valid JWT
- Public routes are strictly read-only
- `get_current_admin` dependency on every admin endpoint

### API6: Unrestricted Access to Sensitive Business Flows
- GitHub sync is admin-only
- File upload is admin-only with strict type allowlist
- Contact form has honeypot + Turnstile + rate limiting + spam scoring

### API7: Server-Side Request Forgery (SSRF)
- Only outbound requests go to trusted endpoints (GitHub API, Resend, Turnstile)
- No user-controlled URLs are fetched server-side
- URLs in project data are stored strings, never fetched

### API8: Security Misconfiguration
- Swagger/OpenAPI disabled in production (`ENVIRONMENT=production`)
- JWT algorithm pinned (`HS256` only — no `none` algorithm)
- Security headers on every response (HSTS, X-Frame-Options, X-Content-Type-Options, etc.)
- CORS allowlist — only configured origins accepted
- Secrets only in environment variables — `.env` is git-ignored
- Non-root Docker user

### API9: Improper Inventory Management
- Single versioned API prefix (`/api/v1/`)
- No deprecated endpoints left running
- Health endpoint for monitoring
- OpenAPI docs only in development

### API10: Unsafe Consumption of APIs
- GitHub API responses validated before DB insert
- Rate limit headers checked before proceeding
- All external HTTP calls have timeouts (5–15 seconds)
- Errors from external APIs are caught and logged, never propagated raw to clients

---

## Additional Security Measures

### Input Validation
- Pydantic v2 validates every request body and query parameter
- String length limits on all fields
- Email format validated via `pydantic[email]`
- Parameterized queries only (SQLAlchemy ORM — no raw SQL string building)

### File Upload Security
- MIME type allowlist (jpeg, png, webp, pdf only)
- Size limit enforced during streaming read (not after full load)
- Random hex filename — prevents path traversal and filename injection
- Files stored outside web-accessible root (served via FastAPI StaticFiles, not raw filesystem)

### Privacy
- IP addresses never stored raw — only a daily-salted HMAC-SHA256 hash (first 16 chars)
- No cookies, no tracking pixels, no third-party analytics
- Contact messages store hashed IP for spam detection only

### Secrets Management
- All secrets via environment variables
- `.env.example` committed; `.env` git-ignored
- No hardcoded keys anywhere in source code
- `SECRET_KEY` must be replaced before production

### Dependency Security
- Pinned versions in `requirements.txt`
- Weekly Dependabot PRs for security patches
- `pip-audit` runs in CI on every push
- Bandit SAST scan in CI
- Trivy container scan on every main branch build
