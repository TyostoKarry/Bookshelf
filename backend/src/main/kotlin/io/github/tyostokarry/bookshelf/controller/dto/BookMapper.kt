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
        googleId = googleId,
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
        googleId = googleId,
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
    pages?.let { book.pages = it }
    coverUrl?.let { book.coverUrl = it }
    description?.let { book.description = it }
    publisher?.let { book.publisher = it }
    publishedDate?.let { book.publishedDate = it }
    isbn13?.let { book.isbn13 = it }
    googleId?.let { book.googleId = it }
    genre?.let { book.genre = it }
    language?.let { book.language = it }
    status?.let { book.status = it }
    progress?.let { book.progress = it }
    startedAt?.let { book.startedAt = it }
    finishedAt?.let { book.finishedAt = it }
    readCount?.let { book.readCount = it }
    rating?.let { book.rating = it }
    notes?.let { book.notes = it }
    favorite?.let { book.favorite = it }

    return book
}
