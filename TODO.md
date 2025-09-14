# Bookshelf App – MVP TODO

## Frontend Basics (React + Vite + TS + Tailwind)

- [x] **Setup**

  - [x] Initialize Vite + React + TS + SWC
  - [x] Add TailwindCSS
  - [x] Configure ESLint + Prettier

- [ ] **Routing**

  - [x] Install + set up React Router
  - [ ] Create routes: `/bookshelf`, `/add`, `/detail/:id`, `/achievements`

- [ ] **Bookshelf Page**

  - [ ] Fetch `/books`
  - [ ] Display covers, author and title grouped by status (Wishlist | Reading | Completed)
  - [ ] Show Google Books coverUrl, else placeholder image

- [ ] **Add Book Page**

  - [ ] Integrate Google Books `/search`
  - [ ] Manual book entry form
  - [ ] Submit new book → `POST /books`

- [ ] **Book Detail Page**

  - [ ] Edit book status (Wishlist → Reading → Completed)
  - [ ] Edit rating (1–5), notes
  - [ ] Save changes → `PUT /books/{id}`

- [ ] **Achievements Page**
  - [ ] Fetch `/achievements`
  - [ ] Display achievement name, tier, progress, requirement

---

## Backend Basics (Spring Boot + Kotlin + SQLite)

- [x] **Project setup**

  - [x] Initialize Spring Boot project
  - [x] Add SQLite integration
  - [x] Configure JPA entities

- [x] **Book entity / API**

  - [x] Create `Book` entity (id, title, author, pages, coverUrl, status, startedAt, finishedAt, rating, notes)
  - [x] `GET /books` → list all books
  - [x] `POST /books` → add new book
  - [x] `PUT /books/{id}` → update book
  - [x] `DELETE /books/{id}` → remove book

- [x] **API Key Authentication**

  - [x] Add `ApiKeyAuthFilter` (validates `X-API-KEY` header)
  - [x] Configure `SecurityFilterChain` to require key for all requests
  - [x] Return consistent JSON error (`ApiResponse`) when missing or invalid
  - [x] Load key from `.env` (`API_KEY`) via `AppProperties`

- [ ] **Achievement system**

  - [ ] Create `Achievement` entity (id, name, tier, progress)
  - [ ] Implement formulas:
    - [ ] Bookworm → books read = `tier² + tier`
    - [ ] Page Turner → pages read = `500 × tier`
    - [ ] Critic → ratings given = `2^tier`
  - [ ] `GET /achievements` → return achievements + progress

- [ ] **Google Books API**
  - [ ] `GET /search?q=term` → proxy to Google Books API

---

## Stretch / Nice-to-Haves

- [ ] Authentication → per-user shelves
- [ ] Responsive design for mobile
- [ ] Bundle frontend build with backend (Spring serving React)
- [ ] Search / filter / sort bookshelf (by title, author, status, rating, finished date)
- [ ] Export / import data (export JSON of bookshelf for backup or migration)
- [ ] Global Stats page (graphs for books/pages per month, ratings breakdown, totals)

---

## Deliverable MVP

- [ ] Search & add books from Google API
- [ ] Add books manually
- [ ] Update status, rating, notes
- [ ] View covers grouped by status
- [ ] Track infinite-tier achievements
