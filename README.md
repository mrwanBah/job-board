# Job Board

A full-stack job board web application. Applicants browse and apply to jobs; companies post listings and manage applicants.

## Architecture

![Architecture diagram](docs/architecture.png)

## Backend local setup

1. Copy `.env.example` to `.env` and replace every placeholder secret.
2. Start PostgreSQL with `docker compose up -d postgres`.
3. Export the `SPRING_DATASOURCE_*` and `JWT_*` values from `.env`.
4. Run `cd backend` followed by `./mvnw spring-boot:run`.

The API runs at `http://localhost:8080`. Swagger UI is available at
`http://localhost:8080/swagger-ui.html`.

The Postman collection is stored at
`postman/Job-Board-API.postman_collection.json`.

Backend tests use an H2 test profile, so they do not require a running PostgreSQL
container:

```bash
cd backend
./mvnw test
```

If Docker is not running and you only need to test the API locally, use the
local H2 profile:

```powershell
cd backend
.\run-local.ps1
```

PostgreSQL data is persisted in the Docker volume `postgres_data`. Stopping and
starting containers keeps the data; deleting the volume removes it.

## Monorepo layout

| Path                 | What it is                                                        |
| -------------------- | ----------------------------------------------------------------- |
| `frontend/`          | React + TypeScript SPA (Vite, Tailwind, React Query, Zustand)     |
| `backend/`           | Java 17 + Spring Boot REST API + PostgreSQL                       |
| `docker-compose.yml` | Runs PostgreSQL + backend + frontend together                     |

## Roles

- **Applicant** — browse/filter jobs, view details, apply with a cover letter, track applications.
- **Company** — post jobs, manage listings (edit/deactivate), review applicants and update status.

## Tech stack

- **Frontend:** React 19, TypeScript, Vite, Tailwind CSS, React Router, TanStack React Query, Zustand, React Hook Form, Axios
- **Backend:** Java 17, Spring Boot, PostgreSQL, JWT auth, Swagger
- **Infra:** Docker / Docker Compose, nginx (frontend), Vercel (frontend deploy)

## Getting started

### Frontend (local dev)

```bash
cd frontend
npm install
npm run dev        # http://localhost:5173
```

Set the API base URL in `frontend/.env.local`:

```
VITE_API_URL=http://localhost:8080
```

### Full stack (Docker)

```bash
docker compose up --build
```

Frontend → http://localhost:5173 · API → http://localhost:8080 · PostgreSQL → :5433

## Screenshots

**Home — browse & filter jobs**
![Home page](docs/screenshots/home.png)

**Post a job**
![Post a job](docs/screenshots/post-job.png)

**Applicant dashboard**
![Applicant dashboard](docs/screenshots/applicant-dashboard.png)

**Company dashboard**
![Company dashboard](docs/screenshots/company-dashboard.png)

## Branching

- `main` — protected; changes land via reviewed pull requests.
- `develop` — integration branch; feature branches merge here first.
