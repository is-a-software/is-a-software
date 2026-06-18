# Contributing

- [Prerequisites](#prerequisites)
- [Setup](#setup)
- [Coding conventions](#coding-conventions)
- [Tests](#tests)
- [Submitting changes](#submitting-changes)

---

## Prerequisites

- **Java 21** (JDK)
- **Maven** (or use the bundled `./mvnw` wrapper)
- **Node.js 18+**
- **MySQL 8+**

---

## Setup

### 1. Clone

```bash
git clone https://github.com/is-a-software/is-a-software
cd is-a-software
```

### 2. Backend

```bash
cd api
cp src/main/resources/application.properties.example src/main/resources/application.properties
```

Create a MySQL database:

```sql
CREATE DATABASE isasoftware;
```

Edit `application.properties` with your local credentials:

| Key | What to set |
|-----|-------------|
| `spring.datasource.url` | `jdbc:mysql://localhost:3306/isasoftware` |
| `spring.datasource.password` | Your MySQL password |
| `jwt.secret` | Any string 32+ characters (HMAC-SHA256 key) |
| `CF_API_KEY` | A Cloudflare API token with DNS edit permissions |
| `CF_ZONE_ID` | Your Cloudflare zone ID |
| `razorpay.key.*` | Razorpay test keys |
| `github.client.*` | GitHub OAuth app credentials |
| `spring.mail.*` | SMTP credentials (use [mailtrap](https://mailtrap.io) for development) |

Tables are created automatically (`spring.jpa.hibernate.ddl-auto=update`).

```bash
./mvnw spring-boot:run
```

The API runs on `http://localhost:8080`.

### 3. Frontend

```bash
cd web
cp .env.local.example .env.local
npm install
```

Edit `.env.local`:

```
NEXT_PUBLIC_API_URL=http://localhost:8080/v1/api
```

```bash
npm run dev
```

The app runs on `http://localhost:3000`.

---

## Coding conventions

### Backend (Java / Spring Boot)

- **Layered architecture:** Controllers handle HTTP, Services contain business logic, Repositories handle data access
- **DTOs:** Use ModelMapper to convert between entities and DTOs — don't expose entities directly
- **Exceptions:** Create a custom `RuntimeException` subclass and let `GlobalExceptionHandling` (`@RestControllerAdvice`) map it to the right HTTP status
- **JPA:** Use auto-increment integer IDs, `@PrePersist` for timestamps, cascade ALL on `@OneToMany` relationships
- **Validation:** Use `@Valid` on request bodies and `jakarta.validation` annotations on DTOs

### Frontend (Next.js / React)

- **Routing:** Use the App Router (`app/` directory). Pages that need interactivity use `'use client'`
- **State:** No global state library. Auth and session data live in `localStorage` with TTL-based caching (`readSessionCache` / `writeSessionCache`)
- **API calls:** All go through `lib/api.js` — it handles JWT headers, timeouts (20s), and 401 redirects. Don't use raw `fetch` for backend calls
- **Errors:** Use the `<ErrorBanner />` component for consistent error display. It handles Cloudflare errors (502), limits (403), validation (422), and subscription (402) specially
- **Styling:** Tailwind CSS v4 with the glass morphism design system (`.glass` cards, blue accent, dark backgrounds)

---

## Tests

```bash
cd api
./mvnw test
```

Currently a single context-loads test exists. Please add tests for new service methods, validation logic, and controllers.

---

## Submitting changes

1. Branch off `main` with a descriptive name
2. Keep commits focused and messages meaningful
3. Test that the backend starts and the frontend compiles
4. Open a pull request describing what you changed and why

### PR checklist

- [ ] Backend compiles (`./mvnw compile`)
- [ ] Frontend compiles (`npm run build`)
- [ ] No hardcoded secrets or credentials
- [ ] New API endpoints are documented in [DOCS.md](DOCS.md) if user-facing
- [ ] Branch is up to date with `main`

### Security issues

Do **not** report security vulnerabilities via public issues. See [SECURITY.md](SECURITY.md) for the responsible disclosure process.

If you're unsure about anything, ask in the [Discord](https://discord.com/invite/AeAjegXn6D).
