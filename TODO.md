# Bookshelf App – MVP TODO

## Frontend Basics (React + Vite + TS + Tailwind)

- [x] **Setup**

  - [x] Initialize Vite + React + TS + SWC
  - [x] Add TailwindCSS
  - [x] Configure ESLint + Prettier

- [ ] **Routing**

  - [x] Install + set up React Router
  - [x] Create routes: `/my/bookshelf`, `/bookshelves/:publicId`, `/books/:bookId`, `/books/:bookId/edit`, `/books/new`
  - [ ] Create routes: `/achievements`

- [x] **Bookshelf Page**

  - [x] Fetch `/books`
  - [x] Display covers, author, title, status and favorite status
  - [x] Show Google Books coverUrl, else placeholder image

- [ ] **Add Book Page**

  - [ ] Integrate Google Books `/search`
  - [x] Manual book entry form
  - [x] Submit new book → `POST /books`

- [ ] **Book Detail Page**

  - [x] Edit book details (title, author, pages, status, startedAt, finishedAt, rating, notes, etc)
  - [x] Edit book coverUrl
  - [x] Save changes updates database
  - [ ] Delete book with confirmation modal

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
  - [x] `GET /books/{id}` → list book by id
  - [x] `POST /bookshelves/{bookshelfPublicId}/books` → add new book to bookshelf
  - [x] `PUT /bookshelves/{bookshelfPublicId}/books/{bookId}` → update book in bookshelf
  - [x] `DELETE /bookshelves/{bookshelfPublicId}/books/{id}` → remove book from bookshelf

- [x] **API Key Authentication**

  - [x] Add `ApiKeyAuthFilter` (validates `X-API-KEY` header)
  - [x] Configure `SecurityFilterChain` to require key for all requests
  - [x] Return consistent JSON error (`ApiResponse`) when missing or invalid
  - [x] Load key from `.env` (`API_KEY`) via `AppProperties`

- [x] **Bookshelf ownership (Edit Token)**

  - [x] Add `editToken` field to `Bookshelf` (UUID generated on create)
  - [x] Return `editToken` **only once** on creation via `BookshelfWithTokenDto`
  - [x] Always return public-safe `BookshelfDto` in GET endpoints (never leaking token)
  - [x] Require `X-BOOKSHELF-TOKEN` for modifying/deleting shelves
  - [x] Require `X-BOOKSHELF-TOKEN` when creating/updating/deleting books in a shelf

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

- [x] Authentication → per-user shelves
- [ ] Responsive design for mobile
- [ ] Bundle frontend build with backend (Spring serving React)
- [ ] Search / filter / sort bookshelf (by title, author, status, rating, finished date)
- [ ] Export / import data (export JSON of bookshelf for backup or migration)
- [ ] Global Stats page (graphs for books/pages per month, ratings breakdown, totals)

---

## Deliverable MVP

- [ ] Search & add books from Google API
- [x] Add books manually
- [x] Update details (title, author, status, rating, notes, etc)
- [x] View BookCards (covers, titles and authors) in bookshelf view
- [ ] Track infinite-tier achievements
