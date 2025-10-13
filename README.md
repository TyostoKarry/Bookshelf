<h1 align="center"> Bookshelf </h1>

<p align="center">
  <img src="https://img.shields.io/badge/frontend-React%20%2B%20TypeScript-blue" />
  <img src="https://img.shields.io/badge/backend-Kotlin%20%2B%20Spring--Boot-purple" />
  <img src="https://img.shields.io/badge/db-SQLite-lightgrey" />
  <img src="https://img.shields.io/badge/CI-GitHub%20Actions-success" />
</p>

<p align="center">
<strong>Work in progress!</strong>
</br>
A full‑stack web application for creating and sharing bookshelves.
</br>
Each bookshelf can store a collection of books with title, author, and additional details.
</br>
Visitors can browse public bookshelves, while owners can create, edit, and manage their own collections.
</p>

## Tech Stack

**Frontend:** React + TypeScript + TailwindCSS + Vite  
**Backend:** Kotlin (Sprint Boot) + SQLite + Gradle  
**Infrastructure:** Docker + GitHub Actions

## Development Environment

The following tools and versions are used during local development of the Bookshelf project.

### Backend

- **Java 21 (LTS)** – developed with Eclipse Temurin 21.0.8
- **Gradle** – use included Gradle Wrapper (`./gradlew`), no need to install globally
- **SQLite** – database used by backend, file-based (`bookshelf.db` auto-created)

### Frontend

- **Node.js 18+** – developed with Node.js v22.13.0

## Dockerized Development Environment

This project includes a full Docker‑based setup for local development with hot reload on both the frontend and backend.

### Backend Hot Reload Prerequisites (IntelliJ IDEA)

> This section applies to **backend development in IntelliJ IDEA**.
> <br/>
> If you only work on the frontend, you can skip this part.

To enable backend hot reload, configure IntelliJ IDEA to automatically rebuild the project whenever you save changes.

1. Open **File** → **Settings** → **Build, Execution, Deployment** → **Compiler**
2. Enable **Build project automatically**

These settings ensure:

- IntelliJ recompiles classes on every save,
- Updated `.class` files sync instantly into the Docker container,
- **Spring Boot DevTools** detects the change and restarts the backend automatically.

> **Note:** <br/>
> If IntelliJ IDEA remains open, its auto‑build process continuously recompiles classes even if you’re editing the code in another editor (like **VS Code**).
> <br/>
> This means backend hot reload can still work in VS Code as long as IntelliJ’s background compiler is active.

### Run the Development Environment

Use the development‑specific Compose file:

```bash
docker compose -f docker-compose.dev.yml up --build
```

This command starts a complete development environment with both the frontend and backend running in Docker:

- **Frontend** – available at [http://localhost:5173](http://localhost:5173)
- **Backend** – available at [http://localhost:8080](http://localhost:8080)

Both services share your local source code through Docker volumes, so changes are reflected instantly without rebuilding or restarting containers.

### Stop the Development Environment

To stop all running services, use:

```bash
docker compose -f docker-compose.dev.yml down
```
