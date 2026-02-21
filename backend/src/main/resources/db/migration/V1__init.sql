CREATE TABLE bookshelves (
    id               BIGSERIAL PRIMARY KEY,
    public_id        VARCHAR(255) NOT NULL UNIQUE,
    name             VARCHAR(255) NOT NULL,
    description      TEXT,
    created_at       TIMESTAMP NOT NULL,
    updated_at       TIMESTAMP NOT NULL,
    edit_token_hash  VARCHAR(255) NOT NULL
);

CREATE TABLE books (
    id              BIGSERIAL PRIMARY KEY,
    bookshelf_id    BIGINT NOT NULL,
    title           VARCHAR(255) NOT NULL,
    author          VARCHAR(255) NOT NULL,
    pages           INTEGER,
    cover_url       VARCHAR(255),
    description     TEXT,
    publisher       VARCHAR(255),
    published_date  DATE,
    isbn13          VARCHAR(255),
    genre           VARCHAR(255),
    language        VARCHAR(255),
    status          VARCHAR(255) NOT NULL,
    progress        INTEGER,
    started_at      DATE,
    finished_at     DATE,
    read_count      INTEGER,
    rating          INTEGER,
    notes           TEXT,
    favorite        BOOLEAN,
    created_at      TIMESTAMP NOT NULL,
    updated_at      TIMESTAMP NOT NULL
);

CREATE INDEX idx_books_bookshelf_id ON books (bookshelf_id);