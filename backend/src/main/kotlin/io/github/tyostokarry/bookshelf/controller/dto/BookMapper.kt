package io.github.tyostokarry.bookshelf.controller.dto

import io.github.tyostokarry.bookshelf.entity.Book

fun Book.toDto(bookshelfPublicId: String) =
    BookDto(
        id = id,
        bookshelfPublicId = bookshelfPublicId,
        title = title,
        author = author,
        pages = pages,
        coverUrl = coverUrl,
        description = description,
        publisher = publisher,
        publishedDate = publishedDate,
        isbn13 = isbn13,
        genre = genre,
        language = language,
        status = status,
        progress = progress,
        startedAt = startedAt,
        finishedAt = finishedAt,
        readCount = readCount,
        rating = rating,
        notes = notes,
        favorite = favorite,
    )

fun CreateBookDto.toEntity(bookshelfId: Long) =
    Book(
        bookshelfId = bookshelfId,
        title = title,
        author = author,
        pages = pages,
        coverUrl = coverUrl,
        description = description,
        publisher = publisher,
        publishedDate = publishedDate,
        isbn13 = isbn13,
        genre = genre,
        language = language,
        status = status,
        progress = progress,
        startedAt = startedAt,
        finishedAt = finishedAt,
        readCount = readCount,
        rating = rating,
        notes = notes,
        favorite = favorite,
    )

fun UpdateBookDto.applyTo(book: Book): Book {
    title?.let { book.title = it }
    author?.let { book.author = it }
    book.pages = this.pages
    book.coverUrl = this.coverUrl
    book.description = this.description
    book.publisher = this.publisher
    book.publishedDate = this.publishedDate
    book.isbn13 = this.isbn13
    genre?.let { book.genre = it }
    language?.let { book.language = it }
    status?.let { book.status = it }
    book.progress = this.progress
    book.startedAt = this.startedAt
    book.finishedAt = this.finishedAt
    readCount?.let { book.readCount = it }
    rating?.let { book.rating = it }
    book.notes = this.notes
    favorite?.let { book.favorite = it }

    return book
}

fun Book.toPortableDto(): BookPortableDto =
    BookPortableDto(
        title = title,
        author = author,
        pages = pages,
        coverUrl = coverUrl,
        description = description,
        publisher = publisher,
        publishedDate = publishedDate,
        isbn13 = isbn13,
        genre = genre,
        language = language,
        status = status,
        progress = progress,
        startedAt = startedAt,
        finishedAt = finishedAt,
        readCount = readCount,
        rating = rating,
        notes = notes,
        favorite = favorite,
    )

fun BookPortableDto.toEntity(bookshelfId: Long): Book =
    Book(
        bookshelfId = bookshelfId,
        title = title,
        author = author,
        pages = pages,
        coverUrl = coverUrl,
        description = description,
        publisher = publisher,
        publishedDate = publishedDate,
        isbn13 = isbn13,
        genre = genre,
        language = language,
        status = status,
        progress = progress,
        startedAt = startedAt,
        finishedAt = finishedAt,
        readCount = readCount,
        rating = rating,
        notes = notes,
        favorite = favorite,
    )
