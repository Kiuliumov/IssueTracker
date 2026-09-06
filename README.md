# IssueTracker

A full-stack issue and project management application.

## Tech Stack

* **Frontend:** Next.js, TypeScript, Tailwind CSS, Axios, MobX
* **Backend:** Python, Django, Django REST Framework
* **Database:** PostgreSQL
* **Background tasks:** Celery
* **Cache / broker:** Redis
* **Testing:** pytest, pytest-django, pytest-mock
* **Code quality:** Black, isort, Flake8, ESLint, Prettier
* **Infrastructure:** Docker, Docker Compose

## Architecture

```text
Next.js
   │
   ▼
Django REST API
   │
   ├── PostgreSQL
   │
   └── Redis
         │
         ▼
      Celery
```

Django handles the API and authentication using **session-based authentication**.
Next.js handles the UI and client-side state with **MobX**.

Redis and Celery handle asynchronous tasks such as password-reset emails.

## Getting Started

### Prerequisites

* Git
* Docker Desktop

### Start the application

From the project root:

```bash
docker compose up --build
```

The application will be available at:

```text
Frontend: http://localhost:3000
Backend:  http://localhost:8000
API:      http://localhost:8000/api/
```

Stop the application:

```bash
docker compose down
```

View logs:

```bash
docker compose logs -f
```

## Testing

Run backend tests:

```bash
docker compose exec backend pytest
```

Run backend formatting and linting:

```bash
black --check backend
isort --check-only backend
flake8 backend
```

Run frontend checks:

```bash
npm run lint
npm run format:check
```

## Current Features

* User registration
* Session-based login/logout
* CSRF protection
* Authentication guards
* Password reset
* Celery background tasks
* Redis integration
* PostgreSQL database
* Docker-based development environment
