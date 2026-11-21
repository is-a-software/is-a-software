# is-a.software Architecture

## Overview

**is-a.software** provides free `*.is-a.software` subdomains to developers. Users sign in through Central Auth, claim subdomains, and manage DNS records (A, AAAA, CNAME, TXT, MX, NS) through a web dashboard. Every account gets 3 DNS records in total, across any number of subdomains.

**Monorepo structure:**
- `server/` — Java 21 / Spring Boot 4.0.3 backend (Maven, PostgreSQL, OIDC sign-in, JWT)
- `client/` — Next.js 16 / React 19 frontend (Tailwind CSS v4, App Router)

---

## Backend (`server/`)

### Stack

| Component | Technology |
|-----------|-----------|
| Runtime | Java 21 |
| Framework | Spring Boot 4.0.3 |
| Database | PostgreSQL via Spring Data JPA + Hibernate |
| Sign-in | Central Auth (OIDC) via `spring-boot-starter-oauth2-client` |
| API auth | Spring Security + JWT (jjwt) |
| Build | Maven |
| DNS API | Cloudflare API v4 (via RestTemplate) |
| Object mapping | ModelMapper |

### Layered Architecture

```
Controller → Service → Repository (JPA) → PostgreSQL
                ↕
          Cloudflare API
```

### Entity Model

```
User (1) ──→ Domain (*) ──→ DnsRecords (*)
```

**Key constraints:**
- `User.centralAuthSub` (the Central Auth `sub`) is unique; it is null only for accounts migrated from the old email/password sign-up until their first Central Auth sign-in
- `DnsRecords` has a unique constraint on `(domain, name, type, value)` — no duplicate records
- Subdomains are globally unique, and also unavailable while Cloudflare already serves records for them

### API Endpoints

| Base path | Controller | Key endpoints |
|-----------|-----------|---------------|
| `v1/api/auth/oauth2/authorization/central-auth` | Spring Security | Starts a Central Auth sign-in (browser navigation) |
| `v1/api/auth/oauth2/callback/central-auth` | Spring Security | Central Auth redirects back here |
| `v1/api/auth` | `AuthController` | `POST /exchange`: one-time code → API token |
| `v1/api/user` | `UserController` | Profile, limits |
| `v1/api/domains` | `DomainController` | CRUD domains, availability check |
| `v1/api/.../records` | `DnsRecordsController` | CRUD DNS records per domain |

### Security

- **Sign-in flow:** browser → backend `/oauth2/authorization/central-auth` → Central Auth (Authorization Code + PKCE S256, state, nonce) → backend callback validates the ID token → `CentralAuthLoginHandler` links or creates the account → redirect to `<frontend>/auth/callback#code=<one-time code>` → frontend `POST /v1/api/auth/exchange` → app JWT (1h, HMAC-SHA256)
- **Account linking:** by `sub`; on the first sign-in of a migrated account, by verified email (case-insensitive). An email already linked to a different `sub` is refused.
- **One-time codes:** 60s, single use, kept in memory (`LoginCodeStore`), so the backend runs as a single instance
- **Request auth:** `JwtAuthenticationFilter` extracts `Authorization: Bearer <token>`, validates via `JwtService` (signature, expiry, `type: LOGIN`), sets `SecurityContext`. Every `/v1/api/**` route except `/auth/**` and `/domains/check` requires it.
- **CORS:** only `app.frontend.url`
- **CSRF:** disabled (API auth is a bearer header, never a cookie). The only session is the short-lived one that holds OIDC state during sign-in.

### External Integrations

| Integration | Purpose | Technology |
|------------|---------|-----------|
| Central Auth (`api.auth.priyazsh.me`) | Sign-in with Google, account identity | OpenID Connect |
| Cloudflare API v4 | DNS record CRUD, zone capacity, existing-name checks | RestTemplate + API token |

### Limits

| Limit | Value | Enforced in |
|-------|-------|-------------|
| DNS records per account | 3 (`DnsService.RECORD_LIMIT_PER_USER`) | `DnsRecordsServiceImpl` |
| Subdomains per account | none | — |
| Records in the whole zone | 200 (Cloudflare Free) | `CloudflareService.ensureZoneCapacity()` |
| Subdomain names | 3-63 lowercase letters, digits, inner hyphens; reserved names (`www`, `api`, `mail`, `admin`, …) refused | `DomainServiceImpl` |

### Error Handling

`GlobalExceptionHandling` (`@RestControllerAdvice`) maps custom `RuntimeException` subclasses to HTTP statuses:

| Exception | Status | Use case |
|-----------|--------|----------|
| `DomainNotFound` | 404 | Domain not found |
| `RecordNotFoundException` | 404 | DNS record not found |
| `RecordConflictException` | 409 | A/AAAA/CNAME conflict on same hostname |
| `InvalidRecordValueException` | 422 | Malformed IP, hostname or subdomain |
| `DnsLimitExceededException` | 403 | Account record limit reached |
| `ZoneCapacityException` | 503 | The zone is at Cloudflare's record limit |
| `CloudflareApiException` | 502 | Cloudflare API error |

---

## Frontend (`client/`)

### Stack

| Component | Technology |
|-----------|-----------|
| Framework | Next.js 16 (App Router) |
| UI | React 19 + Tailwind CSS v4 |
| Build | Next.js (react-compiler enabled) |
| Auth | App JWT in localStorage, obtained after Central Auth sign-in |

### Routes

| Path | Page | Auth required |
|------|------|---------------|
| `/` | Landing (Hero with CTA + DomainChecker at `#check` + Features); shows sign-in errors | No |
| `/signin` | No form: immediately redirects to Central Auth (every "Sign In" routes here) | No |
| `/auth/callback` | Trades the one-time code for the API token | No |
| `/dashboard` | Domain + DNS record management | Yes |
| `/settings` | Name, email (read-only), record limit | Yes |
| `/docs` | Usage guide | No |
| `/about` | About page | No |
| `/privacy` | Privacy policy | No |
| `/terms` | Terms of service | No |

### Component Tree

```
<Layout>
  <Navbar />                — Auth-aware nav, mobile menu
  <Hero />                  — Landing hero section
  <DomainChecker />         — Availability check + CTA
  <Features />              — Feature grid
  <Footer />                — Site footer with links

<Dashboard>                 — Auth-gated main interface
  <StatsGrid />             — Domains/records usage stats
  <DomainList />            — Subdomain CRUD (inline)
  <RecordTable />           — DNS records across all domains (inline editing)
  <DeleteConfirmModal />    — Delete confirmation dialog
  <RecordLimitSummary />    — Usage bar (also used in Settings)

<Settings>
  <RecordLimitSummary />    — Record limit overview

<ProtectedPageLoader />     — Loading state for auth-gated pages
<ErrorBanner />             — Status-aware error display (Cloudflare, validation, limits)
<StatusBadge />             — Active/inactive pill
```

### Data Flow

1. **Auth:** JWT stored in `localStorage` key `is_a_software_token` → read by `getToken()` → attached as `Authorization: Bearer` header in `request()`
2. **API client:** Centralized `request()` function in `lib/api.js` with:
   - 20s timeout via `AbortController`
   - Automatic 401 handling (clear token + dispatch logout event)
   - Network error → special `__BACKEND_DOWN__` flag for `ErrorBanner`
   - Normalizes all API errors into `ApiError` class
3. **Session cache:** Lightweight TTL-based cache in `localStorage` (scoped per token) using `readSessionCache`/`writeSessionCache`
   - User profile: 5min TTL
   - Account limits: 30s TTL
4. **Limits state:** Centralized `useAccountLimits()` hook consumed by Dashboard, Settings and Navbar
5. **Pending claim:** a name checked on the landing page is kept in `sessionStorage` through the sign-in redirect, and the dashboard opens the new-subdomain form with it filled in

### Auth Flow

```
Sign in (also creates the account on first use):
  → any "Sign In" → router.push('/signin') (links never expose the backend URL)
  → /signin sends the browser to <backend>/v1/api/auth/oauth2/authorization/central-auth
  → Central Auth (Google) → back to the backend callback
  → backend redirects to /auth/callback#code=...
  → POST /auth/exchange { code } → { token, user }
  → store token + user in localStorage → /dashboard

Sign-in errors:
  → backend or /auth/callback redirect to /?auth_error=<code>
  → AuthErrorNotice on the landing page shows the message (never a page that redirects again)

Protected route / expired token (401):
  → useRequireAuth() / useUnauthorizedRedirect() → straight to Central Auth
  → with a live Central Auth session the user returns to /dashboard without seeing a screen

Sign out: clears this app's token and goes to the landing page (not /signin, which would sign
the user straight back in through the live Central Auth session).
```

### DNS Management Flow

```
Create record:
  → Select domain (or auto-create record for domain)
  → POST /domains/{id}/records → backend validates:
      - Ownership + the 3-record account limit
      - IPv4/IPv6/hostname format per record type
      - A/AAAA/CNAME uniqueness per hostname
      - Zone capacity (200 records)
  → Backend creates record in Cloudflare API v4
  → Stores cloudflare_id locally
  → Returns DnsRecordsDto

Update/Delete:
  → Ownership check
  → Sync change to Cloudflare first
  → Update/remove local record

Delete domain:
  → Deletes each of its records from Cloudflare, then the domain
```

---

## Key Design Decisions

1. **No frontend state library** — Auth state and session data live in localStorage with TTL-based caching. No Redux/Zustand.
2. **Central Auth for identity** — No passwords or emails are handled here. Accounts are keyed on the Central Auth `sub`; old email/password accounts are linked by verified email on first sign-in so they keep their subdomains.
3. **Database owns, Cloudflare serves** — PostgreSQL records who owns which record and enforces limits; every mutation is written through to Cloudflare. The `cloudflare_id` column links local records to their Cloudflare counterparts.
4. **Flat limits** — 3 records per account, no subdomain cap, no paid tiers. The zone-wide 200-record cap is checked before every create.
5. **Record conflict rules** — A, AAAA, and CNAME records are mutually exclusive per hostname (enforced by `RecordConflictException`). TXT, MX, NS can coexist.

---

## Development Setup

See `application.properties.example` for required config. Key environment-specific values:

| Variable | Description |
|----------|-------------|
| `spring.datasource.*` | PostgreSQL connection |
| `spring.security.oauth2.client.registration.central-auth.client-id` / `client-secret` | Central Auth registration for this environment |
| `app.backend.url` / `app.frontend.url` | Public URLs (the frontend URL is the CORS origin and post-sign-in target) |
| `jwt.secret` | HMAC-SHA256 key for the app's API tokens |
| `CF_API_KEY` | Cloudflare API token |
| `CF_ZONE_ID` | Cloudflare zone ID |

**Migrating from MariaDB:** start the backend once against an empty PostgreSQL database, then run `server/scripts/migrate-mariadb-to-postgres.sh` (see its header).

**Run backend:**
```bash
cd server
./mvnw spring-boot:run
```

**Run frontend:**
```bash
cd client
npm run dev
```
