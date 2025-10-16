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
**Backend:** Kotlin + Spring Boot + SQLite + Gradle  
**Infrastructure:** Docker + GitHub Actions

## Development Environment

The following tools and versions are used during local development of the Bookshelf project.

### Backend

- **Java 21 (LTS)** – developed with Eclipse Temurin 21.0.8
- **Gradle** – use included Gradle Wrapper (`./gradlew`), no need to install globally
- **SQLite** – database used by backend, file-based (`bookshelf.db`)

### Frontend

- **Node.js 18+** – developed with Node.js v22.13.0

## Dockerized Development Environment

This project includes a full Docker‑based setup for local development with hot reload on both the frontend and backend.

### Local SQLite Database

The backend stores data in a local SQLite database file named `bookshelf.db`.

Before running the application (especially inside Docker for the first time),
make sure that the file exists in the `backend` directory:

```bash
cd backend
touch bookshelf.db
```

This prevents Docker from accidentally creating a folder with the same name during volume mounts.
The file is local and ignored by Git, so your development data remains on your machine.

### Frontend Hot Reload

The frontend runs a Vite development server inside its Docker container.

When you edit files under `frontend/src/`, the changes are detected automatically and the browser reloads almost instantly.  
No manual rebuild or container restart is required.

This behavior works the same across all platforms (Windows, macOS, WSL, Linux).

### Backend Hot Reload (Spring Boot + Gradle)

Bookshelf’s backend supports live rebuild and auto‑restart using:

- `./gradlew classes --continuous` (watches for Kotlin source changes)
- **Spring Boot DevTools** (watches compiled `.class` file updates)

Depending on your operating system, hot reload behaves slightly differently:

#### On Linux / WSL2

You can get full backend hot reload **without** any IDE configuration — just run Docker Compose in the [Run the Development Environment](#run-the-development-environment) section.

File changes under `backend/src/` trigger Gradle’s continuous build inside the container, and the running Spring Boot app restarts automatically.

#### On Windows with IntelliJ IDEA

On Windows, file‑watch events aren’t always detected instantly inside Docker due to filesystem translation between Windows → WSL → Docker.

To ensure backend hot reload works reliably, configure the following settings in IntelliJ IDEA:

1. Open **File** → **Settings** → **Build, Execution, Deployment** → **Compiler**
2. Enable **Build project automatically**

This approach ensures consistent development experience across platforms by offloading compilation to IntelliJ when Docker’s Linux file watcher cannot fully detect edits made on Windows file systems.

**Tip:** Even if you edit code in VS Code or another editor, IntelliJ’s compiler can still handle background compilation — just keep IntelliJ open.

### Run the Development Environment

Use the development‑specific Compose file located in the project’s root directory:

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
