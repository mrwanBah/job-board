# Job Board

A full-stack job board web application. Applicants browse and apply to jobs; companies post listings and manage applicants.

## Architecture

![Architecture diagram](docs/architecture.png)

## Backend local setup

1. Copy `.env.example` to `.env` and replace every placeholder secret.
2. Start MySQL with `docker compose up -d mysql`.
3. Export the `SPRING_DATASOURCE_*` and `JWT_*` values from `.env`.
4. Run `cd backend` followed by `./mvnw spring-boot:run`.

The API runs at `http://localhost:8080`. Swagger UI is available at
`http://localhost:8080/swagger-ui.html`.

The Postman collection is stored at
`postman/Job-Board-API.postman_collection.json`.

## Monorepo layout

| Path                 | What it is                                                        |
| -------------------- | ----------------------------------------------------------------- |
| `frontend/`          | React + TypeScript SPA (Vite, Tailwind, React Query, Zustand)     |
| `backend/`           | Java 17 + Spring Boot REST API + MySQL                            |
| `docker-compose.yml` | Runs MySQL + backend + frontend together                          |

## Roles

- **Applicant** — browse/filter jobs, view details, apply with a cover letter, track applications.
- **Company** — post jobs, manage listings (edit/deactivate), review applicants and update status.

## Tech stack

- **Frontend:** React 19, TypeScript, Vite, Tailwind CSS, React Router, TanStack React Query, Zustand, React Hook Form, Axios
- **Backend:** Java 17, Spring Boot, MySQL, JWT auth, Swagger
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

Frontend → http://localhost:5173 · API → http://localhost:8080 · MySQL → :3307

## Screenshots

<!-- Add screenshots once the app looks the way you want, e.g.: -->
<!-- ![Home page](docs/screenshots/home.png) -->
<!-- ![Job detail + apply](docs/screenshots/job-detail.png) -->
<!-- ![Company dashboard](docs/screenshots/dashboard.png) -->

## Branching

- `main` — protected; changes land via reviewed pull requests.
- `develop` — integration branch; feature branches merge here first.
