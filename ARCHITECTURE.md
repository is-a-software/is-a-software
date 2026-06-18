# is-a.software Architecture

## Overview

**is-a.software** provides free `*.is-a.software` subdomains to developers. Users register, claim a subdomain, and manage DNS records (A, AAAA, CNAME, TXT, MX, NS) through a web dashboard.

**Monorepo structure:**
- `server/` — Java 21 / Spring Boot 4.0.3 backend (Maven, MariaDB, JWT)
- `client/` — Next.js 16 / React 19 frontend (Tailwind CSS v4, App Router)

---

## Backend (`server/`)

### Stack

| Component | Technology |
|-----------|-----------|
| Runtime | Java 21 |
| Framework | Spring Boot 4.0.3 |
| Database | MariaDB via Spring Data JPA + Hibernate |
| Security | Spring Security + JWT (jjwt) |
| Build | Maven |
| Payments | Razorpay Java SDK |
| DNS API | Cloudflare API v4 (via RestTemplate) |
| Email | JavaMailSender |
| Object mapping | ModelMapper |

### Layered Architecture

```
Controller → Service → Repository (JPA) → MariaDB
                ↕
          Cloudflare API / Razorpay / GitHub API
```

### Entity Model

```
User (1) ──→ Domain (*) ──→ DnsRecords (*)
  │
  ├── Subscription (*)  [FREE / PREMIUM / PREMIUM_PLUS]
  │
  └── Social (1)        [GitHub connection + star bonus]
```

**Key constraints:**
- `DnsRecords` has a unique constraint on `(domain, name, type, value)` — no duplicate records
- `Social` has a unique constraint on `(user_id)` — one GitHub connection per user
- Subdomains are globally unique

### API Endpoints

| Base path | Controller | Key endpoints |
|-----------|-----------|---------------|
| `v1/api/auth` | `AuthController` | OTP request/verify, login, forgot/reset/change password |
| `v1/api/user` | `UserController` | Profile, subscription, limits, email change |
| `v1/api/domains` | `DomainController` | CRUD domains, availability check |
| `v1/api/.../records` | `DnsRecordsController` | CRUD DNS records per domain |
| `v1/api/premium` | `PremiumController` | Razorpay checkout, payment confirmation |
| `v1/api/cloudflare` | `CloudflareController` | Token verification |
| `v1/api/github` | `GitHubController` | OAuth start/callback, status, star re-verify |

### Security

- **Login flow:** Email/password → `AuthenticationManager` → JWT (1h expiry, HMAC-SHA256) → returned to client
- **Request auth:** `JwtAuthenticationFilter` extracts `Authorization: Bearer <token>`, validates via `JwtService`, sets `SecurityContext`
- **Reset tokens:** Separate JWT with 5min expiry, claim `type: "RESET"`
- **CORS:** Only `http://localhost:3000` allowed
- **CSRF:** Disabled (stateless API)

### External Integrations

| Integration | Purpose | Technology |
|------------|---------|-----------|
| Cloudflare API v4 | DNS record CRUD, zone management | RestTemplate + API token |
| Razorpay | Subscription payment processing | Razorpay Java SDK + HMAC-SHA256 signature verification |
| GitHub OAuth | Connect account, verify repo star | OAuth2 flow + GitHub REST API |
| SMTP (mailtrap) | OTP and password reset emails | JavaMailSender |

### Plan Limits

| Plan | Domains | DNS Records | GitHub Bonus |
|------|---------|-------------|--------------|
| FREE | 2 | 5 | +3 DNS records |
| PREMIUM (₹79/yr) | 10 | 50 | — |
| PREMIUM_PLUS (₹129/yr) | 50 | 200 | — |

### Error Handling

`GlobalExceptionHandling` (`@RestControllerAdvice`) maps custom `RuntimeException` subclasses to HTTP statuses:

| Exception | Status | Use case |
|-----------|--------|----------|
| `DuplicateUserException` | 409 | Duplicate email during registration |
| `DomainNotFound` | 404 | Domain not found |
| `RecordNotFoundException` | 404 | DNS record not found |
| `RecordConflictException` | 409 | A/AAAA/CNAME conflict on same hostname |
| `InvalidRecordValueException` | 422 | Malformed IP or hostname |
| `WrongPasswordException` | 401 | Incorrect current password |
| `DnsLimitExceededException` | 403 | DNS record limit reached |
| `SubscriptionRequiredException` | 402 | No active subscription |
| `CloudflareApiException` | 502 | Cloudflare API error |

---

## Frontend (`client/`)

### Stack

| Component | Technology |
|-----------|-----------|
| Framework | Next.js 16 (App Router) |
| UI | React 19 + Tailwind CSS v4 |
| Build | Next.js (react-compiler enabled) |
| Auth | JWT in localStorage |
| Payments | Razorpay SDK (loaded dynamically) |

### Routes

| Path | Page | Auth required |
|------|------|---------------|
| `/` | Landing (Hero + DomainChecker + Features) | No |
| `/signin` | Login form | No |
| `/signup` | Registration form | No |
| `/signup/verify` | OTP verification | No |
| `/forgot-password` | Password reset request | No |
| `/reset-password` | Password reset with token | No |
| `/dashboard` | Domain + DNS record management | Yes |
| `/settings` | Profile, password, add-ons | Yes |
| `/subscriptions` | Plan selection + Razorpay checkout | Yes |
| `/premium` | Redirects to `/subscriptions` | Yes |
| `/github` | GitHub OAuth connection + star verification | Yes |
| `/github/callback` | OAuth callback handler | No |
| `/docs` | Usage guide | No |
| `/about` | About page | No |
| `/privacy` | Privacy policy | No |
| `/terms` | Terms of service | No |

### Component Tree

```
<Layout>
  <Navbar />                — Auth-aware nav, premium badge, mobile menu
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
  <RecordLimitSummary />    — Limits/add-ons overview

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
   - Country detection: 5min TTL
4. **Limits state:** Centralized `useAccountLimits()` hook consumed by Dashboard, Settings, Navbar, and Subscriptions pages

### Auth Flow

```
Signup: email + name + password
  → POST /auth/register/request-otp → OTP emailed
  → POST /auth/register/verify-otp → user created + FREE subscription
  → redirect to /signin

Login: email + password
  → POST /auth/login → JWT returned
  → store token + user in localStorage
  → redirect to /dashboard

Protected route:
  → useRequireAuth() checks for token
  → missing → router.replace('/signin')
  → present → render page
```

### DNS Management Flow

```
Create record:
  → Select domain (or auto-create record for domain)
  → POST /domains/{id}/records → backend validates:
      - Ownership + plan limits
      - IPv4/IPv6/hostname format per record type
      - A/AAAA/CNAME uniqueness per hostname
  → Backend creates record in Cloudflare API v4
  → Stores cloudflare_id locally
  → Returns DnsRecordsDto

Update/Delete:
  → Ownership check
  → Sync change to Cloudflare first
  → Update/remove local record
```

### Payment Flow

```
1. User selects plan on /subscriptions
2. Frontend POST /premium/checkout → Razorpay subscription created
3. Frontend opens Razorpay checkout modal (loaded from CDN)
4. User completes payment in Razorpay iframe
5. Frontend POST /premium/checkout/confirm with:
     { subscriptionId, paymentId, signature }
6. Backend verifies HMAC-SHA256 signature
7. Backend fetches payment from Razorpay, validates plan_id match
8. Backend activates subscription (expires old, creates 1-year new)
```

---

## Key Design Decisions

1. **No frontend state library** — Auth state and session data live in localStorage with TTL-based caching. No Redux/Zustand.
2. **OTP-based registration** — Email verification via OTP with 60s expiry. Prevents unverified signups. OTPs stored in-memory (not in DB) — lost on server restart.
3. **Cloudflare as source of truth for DNS** — Every local DNS mutation is synced to Cloudflare API. The `cloudflare_id` column links local records to their Cloudflare counterparts.
4. **GitHub star bonus** — Users who star the repo get +3 DNS record limit. Re-verifiable via OAuth re-connect.
5. **Implicit FREE plan** — Every user gets a FREE subscription on registration. Subscriptions are tiered as `Subscription` entity (not a User field) to support history.
6. **Record conflict rules** — A, AAAA, and CNAME records are mutually exclusive per hostname (enforced by `RecordConflictException`). TXT, MX, NS can coexist.

---

## Development Setup

See `application.properties.example` for required config. Key environment-specific values:

| Variable | Description |
|----------|-------------|
| `jwt.secret` | HMAC-SHA256 key for JWT signing |
| `cloudflare.api-key` | Cloudflare API token |
| `cloudflare.zone-id` | Cloudflare zone ID |
| `cloudflare.email` | Cloudflare account email |
| `razorpay.key-id` | Razorpay API key |
| `razorpay.key-secret` | Razorpay secret |
| `github.client-id` | GitHub OAuth app client ID |
| `github.client-secret` | GitHub OAuth app secret |
| `spring.mail.*` | SMTP (mailtrap) credentials |

**Run backend:**
```bash
cd apps/api
./mvnw spring-boot:run
```

**Run frontend:**
```bash
cd apps/web
npm run dev
```
