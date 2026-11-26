# Task Management — Full-Stack Application

A simple task management application built with React, TypeScript, Node.js, Express, and PostgreSQL. It demonstrates a complete client–server workflow with persistent data, input validation, error handling, and basic API integration tests.

**Project status:** Functional local full-stack MVP. Docker, Kubernetes, deployment, and CI/CD are planned, not yet implemented.

**Interface language:** Turkish.

## Features

- Create, list, edit, complete, and delete tasks
- Filter tasks by all, active, or completed status
- Persist tasks in PostgreSQL using UUID identifiers
- Validate incoming API data and return appropriate HTTP status codes
- Display loading and error states, with a retry action when task loading fails
- Log HTTP requests and expose a health-check endpoint
- Run automated API integration tests using Node.js's built-in test runner

## Tech Stack

| Layer | Technologies |
| --- | --- |
| Frontend | React, TypeScript, Vite, CSS |
| Backend | Node.js, TypeScript, Express |
| Database | PostgreSQL, `pg` |
| Testing | Node.js `node:test`, HTTP `fetch` |
| Version control | Git, GitHub |

## Architecture

```text
Browser (React + TypeScript)
          |
          | /api/* via Vite development proxy
          v
Node.js + Express REST API
          |
          | SQL queries via pg connection pool
          v
      PostgreSQL
```

The frontend manages user interactions and displays API responses. The backend validates requests and handles task operations. PostgreSQL stores task data so it remains available after the backend restarts.

## Project Structure

```text
frontend/
  src/                 # React components, task types, application UI
  vite.config.ts       # Development proxy for /api requests
backend/
  src/
    db/pool.ts         # PostgreSQL connection pool
    routes/tasks.ts    # Task REST endpoints
    validation/        # Request validation
    middleware/        # HTTP logging and error handling
    index.ts           # Express application startup
  sql/
    001_create_tasks.sql
  tests/
    api.test.cjs       # API integration tests
README.md
```

## Getting Started

### Prerequisites

- Node.js 24 and npm (development environment used for this project)
- PostgreSQL 17, running locally
- PostgreSQL command-line tools (`psql`, `createdb`)

This project was developed on macOS with Postgres.app. Its default backend connection uses the local PostgreSQL Unix socket at `/tmp`. For other PostgreSQL setups, configure the `PG*` environment variables described below.

### 1. Clone the repository

```bash
git clone https://github.com/haydindev/task-management.git
cd task-management
```

### 2. Create the database and table

Verify that PostgreSQL is running:

```bash
pg_isready
```

Create the database **if it does not already exist**, then apply the schema from the repository root:

```bash
createdb task_management
psql -v ON_ERROR_STOP=1 -d task_management -f backend/sql/001_create_tasks.sql
```

### 3. Start the backend (Terminal 1)

```bash
cd backend
npm ci
npm run build
npm start
```

The API runs at **http://localhost:3000**. Check it with:

```bash
curl http://localhost:3000/health
```

### 4. Start the frontend (Terminal 2)

From the repository root, open a second terminal:

```bash
cd frontend
npm ci
npm run dev
```

Open the local address printed by Vite (normally **http://localhost:5173**).

The development proxy forwards `/api` requests to the backend on port 3000. Keep both servers running while using the application.

### Database configuration

The backend reads these optional environment variables:

| Variable | Local default | Purpose |
| --- | --- | --- |
| `PGHOST` | `/tmp` | PostgreSQL Unix socket directory or host |
| `PGPORT` | `5432` | Database port |
| `PGDATABASE` | `task_management` | Database name |
| `PGUSER` | Current OS user | PostgreSQL user |
| `PGPASSWORD` | Not set | Password, if required |

For a TCP-based PostgreSQL installation, set `PGHOST=localhost` and provide suitable credentials before starting the backend. Do not commit credentials to Git.

## REST API

| Method | Endpoint | Purpose | Success status |
| --- | --- | --- | --- |
| GET | `/health` | Health check | 200 |
| GET | `/api/tasks` | List tasks | 200 |
| POST | `/api/tasks` | Create a task | 201 |
| PATCH | `/api/tasks/:id` | Update a task's title or completion status | 200 |
| DELETE | `/api/tasks/:id` | Delete a task | 204 |

Example request:

```bash
curl -X POST http://localhost:3000/api/tasks \
  -H "Content-Type: application/json" \
  -d '{"title":"Learn Docker"}'
```

Task IDs are UUIDs. Invalid input returns a `400` response, and missing tasks return `404`.

## Testing

With PostgreSQL and the backend running, open another terminal:

```bash
cd backend
node --test tests/api.test.cjs
```

The three integration tests cover the health endpoint, invalid task input, and a complete create/read/update/delete cycle. The CRUD test removes the task it creates. These tests run against a **real local API and database**, so use a development environment.

You can also verify the frontend production build:

```bash
cd frontend
npm run build
```

## Roadmap

- [x] Full-stack task CRUD with PostgreSQL persistence
- [x] Request validation, error handling, loading states, and retry
- [x] Basic API integration tests
- [ ] Docker images and Docker Compose
- [ ] Kubernetes deployment and service configuration
- [ ] CI/CD with GitHub Actions
- [ ] Deployment instructions and portfolio demo

## Project Goal

This project is both a hands-on full-stack application and a foundation for learning containerization, Kubernetes, and DevOps practices. The focus is on building a working system that can be explained, tested, and improved incrementally.
