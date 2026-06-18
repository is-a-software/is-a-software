<center>
<h1>is-a.software</h1>


Free `*.is-a.software` subdomains for developers.
</center>
<p>
  <img src="https://img.shields.io/badge/Java-21-%23ED8B00" alt="Java 21">
  <img src="https://img.shields.io/badge/Spring_Boot-4.0.3-%236DB33F" alt="Spring Boot 4.0.3">
  <img src="https://img.shields.io/badge/Next.js-16-%23000000" alt="Next.js 16">
  <img src="https://img.shields.io/badge/React-19-%2358C4DC" alt="React 19">
  <img src="https://img.shields.io/badge/MySQL-8+-%234479A1" alt="MySQL 8+">
  <img src="https://img.shields.io/badge/license-MIT-blue" alt="MIT License">
</p>

---

## What is this?

Claim a subdomain like `myproject.is-a.software` and point it to your website with custom DNS records (A, AAAA, CNAME, TXT, MX, NS). Built with a Java/Spring Boot backend and a Next.js frontend.

## Quick start

```bash
# Backend
cd api
cp src/main/resources/application.properties.example src/main/resources/application.properties
# edit application.properties with your DB credentials
./mvnw spring-boot:run

# Frontend
cd web
cp .env.local.example .env.local
npm install
npm run dev
```

## Project structure

```
.
├── api/              # Java 21 / Spring Boot 4.0.3 backend
│   ├── src/main/
│   │   ├── java/.../controller/   # REST controllers
│   │   ├── java/.../service/      # Business logic
│   │   ├── java/.../entity/       # JPA entities
│   │   ├── java/.../repository/   # Data access
│   │   ├── java/.../security/     # JWT auth
│   │   └── resources/             # Config
│   └── pom.xml
├── web/              # Next.js 16 / React 19 frontend
│   ├── app/          # App Router pages
│   ├── components/   # React components
│   ├── lib/          # API client & auth utilities
│   └── package.json
├── ARCHITECTURE.md   # Architecture deep-dive
├── CONTRIBUTING.md   # How to contribute
├── DOCS.md           # End-user guide (how to get a subdomain)
├── LICENSE
└── SECURITY.md        # Security policy
```

## Docs

| File | What it covers |
|------|---------------|
| [ARCHITECTURE.md](ARCHITECTURE.md) | Tech stack, entity model, security flow, key design decisions |
| [DOCS.md](DOCS.md) | Step-by-step guide with platform examples |
| [CONTRIBUTING.md](CONTRIBUTING.md) | Setup, coding conventions, submitting PRs |
| [SECURITY.md](SECURITY.md) | Vulnerability reporting |

## License

MIT — see [LICENSE](LICENSE).
