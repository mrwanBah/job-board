# Job Board

A full-stack job board web application. Applicants browse and apply to jobs; companies post listings and manage applicants.

## Monorepo layout

| Path                 | What it is                                                        |
| -------------------- | ----------------------------------------------------------------- |
| `frontend/`          | React + TypeScript SPA (Vite, Tailwind, React Query, Zustand)     |
| `backend/`           | Java 17 + Spring Boot REST API + MySQL *(in progress)*            |
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

Frontend → http://localhost:5173 · API → http://localhost:8080 · MySQL → :3306

## Branching

- `main` — protected; changes land via reviewed pull requests.
- `develop` — integration branch; feature branches merge here first.
