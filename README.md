# Production-Grade Node.js Modular Monolith

An enterprise-ready **Modular Monolithic API** built in **pure JavaScript (ES2022 ESM)** running natively on Node.js 18+. Engineered with domain-driven modularity, clean 4-layer separation of concerns, OWASP-aligned security hardening, RFC 7807 problem details error handling, in-process domain event streaming, and strict automated quality policy gates.

---

## 🌟 Key Features

- **Pure JavaScript (Modern ESM)**: Built natively with Node.js 18+ ECMAScript Modules (`"type": "module"`). Zero compilation, transpilation, or bundling overhead.
- **100% JSDoc Annotated**: Every class, function, DTO schema, and method includes rich JSDoc documentation providing deep editor IntelliSense and self-documenting code.
- **Strict Quality Policy Gates**: Pre-configured CI gates for ESLint (`--max-warnings 0`), Prettier formatting, Vitest with strict coverage thresholds (>80%), and npm security audit.
- **Modular Monolith Architecture**: High cohesion, low coupling. Encapsulates bounded contexts (`auth`, `users`, `products`, `health`) with decoupled communication via an in-process asynchronous `EventBus`.
- **Layered Architecture**: Strict boundaries between HTTP Routing, Controllers, pure Business Services, and Abstract Repositories (`IRepository` / `InMemoryRepository`).
- **Security Hardened (OWASP Aligned)**:
  - Helmet for security HTTP headers
  - CORS with origin whitelisting
  - Rate limiting (standard IP limiter + strict authentication rate limiter)
  - Bcrypt password hashing (12 salt rounds)
  - JWT token pair generation (short-lived access tokens + rotated refresh tokens)
  - Zod runtime schema validation on query, params, and body
- **RFC 7807 Problem Details**: Universal error serialization format for clear, machine-readable API error contracts.
- **Observability**: Structured JSON logging via **Pino** with sensitive field redaction (`password`, `token`, `authorization`) and unique correlation ID tracing (`X-Request-Id`).
- **Interactive Documentation**: Embedded **Swagger UI** (`/api/docs`) powered by OpenAPI 3.0.
- **Cloud-Ready Containerization**: Optimized multi-stage `Dockerfile` running as an unprivileged `nodejs` non-root user with health checks and `docker-compose.yml`.

---

## 📁 Project Structure

```
monolithicsample/
├── .github/
│   └── workflows/
│       └── ci.yml                     # Policy Gate CI Pipeline (Lint, Format, Test, Audit)
├── docs/
│   ├── ARCHITECTURE.md                # Architecture Decision Records & Mermaid Diagrams
│   ├── API.md                         # Detailed API Specification & Response Payloads
│   └── CODING_STANDARDS.md            # Coding Conventions, JSDoc rules, Commit Standards
├── src/
│   ├── config/                        # Validated Environment Configuration (Zod)
│   │   ├── env.config.js
│   │   └── index.js
│   ├── constants/                     # HTTP Codes, Application Error Codes, RBAC Roles
│   │   ├── error-codes.constant.js
│   │   ├── http-status.constant.js
│   │   ├── roles.constant.js
│   │   └── index.js
│   ├── core/                          # Cross-Cutting Core Infrastructure
│   │   ├── database/                  # Base Repository & InMemoryRepository
│   │   ├── errors/                    # RFC 7807 Error Hierarchy (AppError, NotFound, etc.)
│   │   ├── events/                    # Asynchronous In-Process Domain Event Bus
│   │   ├── logger/                    # Structured Pino Logger with Redaction
│   │   └── middlewares/               # RequestId, AccessLogger, Auth, RBAC, RateLimiter, ErrorHandler
│   ├── docs/                          # OpenAPI 3.0 Specification
│   │   └── openapi.json
│   ├── modules/                       # Domain Bounded Contexts
│   │   ├── auth/                      # Authentication (Register, Login, Refresh, Logout)
│   │   ├── health/                    # K8s Liveness & Readiness Probes
│   │   ├── products/                  # Catalog Domain (Pagination, Filter, Search, CRUD)
│   │   └── users/                     # User Management & Profile
│   ├── utils/                         # Pure Utilities (Crypto, Pagination, Response envelope)
│   ├── app.js                         # Express App Setup & Middleware Pipeline
│   └── server.js                      # Server Entrypoint with Graceful Shutdown
├── tests/
│   ├── integration/                   # Supertest Integration Tests (Health, Auth, Users, Products)
│   ├── unit/                          # Vitest Unit Tests (Services, Repositories, Utils)
│   └── setup.js                       # Test Environment Bootstrap
├── .dockerignore
├── .editorconfig
├── .env.example
├── .env
├── .eslintrc.cjs
├── .gitignore
├── .prettierrc
├── docker-compose.yml
├── Dockerfile
├── jsconfig.json
├── package.json
└── vitest.config.js
```

---

## 🚀 Getting Started

### Prerequisites
- **Node.js**: `v18.0.0` or higher
- **npm**: `v8.0.0` or higher

### 1. Installation
```bash
npm install
```

### 2. Environment Configuration
Copy `.env.example` to `.env` and configure settings:
```bash
cp .env.example .env
```

| Variable | Description | Default |
| :--- | :--- | :--- |
| `NODE_ENV` | Runtime environment (`development`, `test`, `production`) | `development` |
| `PORT` | HTTP port to bind listener | `3000` |
| `HOST` | Network interface to bind listener | `0.0.0.0` |
| `CORS_ORIGIN` | Allowed CORS origins (`*` or comma-separated URLs) | `*` |
| `LOG_LEVEL` | Pino log level (`trace`, `debug`, `info`, `warn`, `error`, `fatal`) | `info` |
| `JWT_SECRET` | Secret key for signing access tokens (min 32 chars) | *pre-configured* |
| `JWT_EXPIRES_IN`| Lifetime of access tokens | `1h` |
| `JWT_REFRESH_SECRET` | Secret key for signing refresh tokens (min 32 chars) | *pre-configured* |
| `JWT_REFRESH_EXPIRES_IN` | Lifetime of refresh tokens | `7d` |
| `RATE_LIMIT_WINDOW_MS` | Rate limiting window in milliseconds | `900000` (15 min) |
| `RATE_LIMIT_MAX` | Max requests allowed per IP within window | `100` |

### 3. Running the Server

#### Development Mode (Native Hot Reload):
```bash
npm run dev
```

#### Production Mode:
```bash
npm start
```

Once started, explore the service:
- **Interactive Swagger Docs**: [http://localhost:3000/api/docs](http://localhost:3000/api/docs)
- **Readiness Health Probe**: [http://localhost:3000/health/ready](http://localhost:3000/health/ready)
- **Liveness Health Probe**: [http://localhost:3000/health/live](http://localhost:3000/health/live)

---

## 🛡️ Coding Policy Gates & Verification

Run the automated quality assurance suite:

```bash
# Gate 1: Code Formatting Check
npm run format:check

# Gate 2: Static Code Analysis & Linting
npm run lint

# Gate 3 & 4: Automated Tests with Code Coverage Thresholds (>80%)
npm run test:coverage

# Gate 5: Security Audit
npm run audit:security
```

Auto-fix format and lint issues:
```bash
npm run format:fix
npm run lint:fix
```

---

## 🐳 Docker Deployment

### Run via Docker Compose:
```bash
docker-compose up --build -d
```

### Build & Run Standalone Image:
```bash
docker build -t monolithic-api .
docker run -p 3000:3000 --env-file .env monolithic-api
```
The Docker image runs under an unprivileged user (`nodejs`, UID 1001) for container security compliance.

---

## 📚 Documentation Links
- [Architecture & Domain Model](docs/ARCHITECTURE.md)
- [API Specification & Examples](docs/API.md)
- [Coding Standards & Conventions](docs/CODING_STANDARDS.md)
