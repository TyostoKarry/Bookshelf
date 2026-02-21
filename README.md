<h1 align="center"> Bookshelf </h1>

<p align="center">
  <img src="https://img.shields.io/badge/frontend-React%20%2B%20TypeScript-blue" />
  <img src="https://img.shields.io/badge/backend-Kotlin%20%2B%20Spring--Boot-purple" />
  <img src="https://img.shields.io/badge/db-PostgreSQL-336791" />
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
**Backend:** Kotlin + Spring Boot + PostgreSQL + Flyway + Gradle  
**Infrastructure:** Docker + GitHub Actions

## Development Environment

For the best developer experience, performance, and instant hot-reloading, the database runs in Docker while the backend and frontend run natively on your local machine.

### Prerequisites

You will need the following installed on your machine:

- **Java 21 (LTS)** – developed with Eclipse Temurin 21.0.8
- **Node.js 22+** – developed with Node.js 22.13.0
- **Docker Desktop / Engine** – used to run the PostgreSQL database

## Run the Development Environment

You will need three terminal instances (or run the database in the background).

### 1. Start the Database

The project uses a local PostgreSQL database managed via Docker Compose. Local credentials (`postgres`/`password`) are hardcoded in the Spring Boot `dev` profile, so no database `.env` configuration is required!

From the root of the project:

```bash
docker compose -f docker-compose.dev.yml up -d
```

_Note: Database schema migrations are handled automatically by Flyway when the backend starts._

### 2. Start the Backend

Run the Spring Boot application using the included Gradle wrapper. It will automatically connect to the local Docker database.

```bash
cd backend
./gradlew bootRun --args='--spring.profiles.active=dev'
```

The backend will be available at [http://localhost:8080](http://localhost:8080)

#### Backend Hot Reload with IntelliJ IDEA

When running the backend natively via `./gradlew`, Spring Boot DevTools will automatically restart the server whenever compiled `.class` files change.

If you are using IntelliJ IDEA, it does not compile files automatically on save by default. To enable seamless hot-reloading:

1. Open **File** → **Settings** → **Build, Execution, Deployment** → **Compiler**
2. Enable **Build project automatically**

With this enabled, IntelliJ will compile your code in the background the moment you save a file, instantly triggering a Spring Boot DevTools restart.

**Tip:** Even if you prefer to write code in VS Code or another editor, you can keep IntelliJ open in the background to handle the automatic compilation!

### 3. Start the Frontend

Run the Vite development server. It proxies API requests to the local backend.

```bash
cd frontend
npm install
npm run dev
```

The Frontend will be available at [http://localhost:5173](http://localhost:5173)

### Stop the Development Environment

1. Stop the frontend and backend terminal processes using `Ctrl + C`.
2. Stop the PostgreSQL database:

```bash
docker compose -f docker-compose.dev.yml down
```

_(Tip: If you ever want to completely wipe your local database and start fresh, run `docker compose -f docker-compose.dev.yml down -v` to destroy the Docker volume)._

## Production Environment

All three services (database, backend, frontend) run in Docker. The frontend is built at image build time with the provided environment variables baked in.

### Prerequisites

You will need the following installed on your server:

- **Docker Desktop / Engine** – used to run all services

### 1. Configure Environment Variables

Copy the example environment file and fill in your values:

```bash
cp .env.example .env
```

Open `.env` and fill in all empty fields — each field has a comment explaining its purpose and any requirements.

### 2. Start the Production Environment

From the root of the project:

```bash
docker compose up --build -d
```

- The frontend will be available at your server's IP or domain (as set in `FRONTEND_URL` in `.env`)
- The backend API will be available on port 8080 of your server's IP or domain (as set in `VITE_SERVER_URL` in `.env`)

_Note: Database schema migrations are handled automatically by Flyway when the backend starts._

### Stop the Production Environment

```bash
docker compose down
```

_(Tip: If you ever want to completely wipe the production database and start fresh, run `docker compose down -v` to destroy the Docker volume. **This will permanently delete all data.**)_
