# CLAUDE.md

Guidance for working in this repository.

## Project

Job Board web application. A monorepo with a **React frontend** and a **Spring Boot backend**, run together with **Docker Compose**.

Two user roles drive the product:

- **APPLICANT** — browse and filter jobs, view job details, apply with a cover letter, track their applications.
- **COMPANY** — post jobs, manage their own listings (edit / deactivate), review applicants and update application status.

> **Status:** early scaffolding stage. The layout and stack below describe the agreed **target** structure from the project plan — most files do not exist yet. Confirm what is actually present before assuming a path exists.

## Repository layout (target)

```
.
├── frontend/            # React + TypeScript SPA (Vite)
├── backend/             # Java 17 + Spring Boot REST API (port 8080)
├── docker-compose.yml   # mysql + backend + frontend
├── .env.example         # template for required secrets
└── README.md
```

## Frontend

- **React + TypeScript**, bundled with **Vite**
- **Routing:** React Router v6 — `/`, `/jobs/:id`, `/login`, `/register`, `/dashboard`
- **Server state:** TanStack React Query (`hooks/useJobs.ts` wraps the jobs API with filters)
- **Auth/client state:** Zustand store, persisted — `token`, `user`, `setAuth`, `logout`
- **Forms:** React Hook Form (email validation, password min 8 chars)
- **HTTP:** a single Axios instance with `baseURL`, a JWT `Authorization` request interceptor, and **401 → auto-logout**
- **Styling:** Tailwind CSS
- **Env:** `VITE_API_URL` (e.g. `http://localhost:8080`), kept in `.env.local` (gitignored)

### `frontend/src/` structure

```
api/         # authApi, jobsApi, applicationsApi, axiosInstance
components/   # Navbar, JobCard, FilterBar, ProtectedRoute, DashboardLayout
hooks/        # useJobs, ...
pages/        # Home, JobDetail, Login, Register, PostJob, MyJobs,
             # Applications (company), MyApplications (applicant)
stores/       # authStore
types/        # Job, Company, User, ApiResponse, JobFilters
utils/
```

## Backend

- **Java 17 + Spring Boot** REST API on port **8080**
- **MySQL** database
- **JWT** authentication
- **Swagger UI** for API documentation

## Auth flow

JWT-based. On login the token is stored in the persisted Zustand store and attached to every request by the Axios interceptor. A `401` response triggers auto-logout. `ProtectedRoute` redirects unauthenticated users to `/login`. The **Apply** action is gated to the `APPLICANT` role behind an auth check.

## Common commands

Full stack (from repo root):

```bash
docker compose up          # starts mysql, backend, and frontend
```

Frontend (from `frontend/`):

```bash
npm install
npm run dev                # Vite dev server
npm run build
```

## Conventions

- **Branches:** `main` (protected — 1 approval required to merge) and `develop`.
- **Deploy:** frontend deploys to **Vercel**; set `VITE_API_URL` as a Vercel env var.
- **Containers (multi-stage):**
  - frontend — `node:20-alpine` build → `nginx:alpine` serve, with `nginx.conf` SPA routing via `try_files`
  - backend — `eclipse-temurin:17-jdk` build → JRE runtime
- Secrets live in `.env` (gitignored); keep `.env.example` in sync as the template.
