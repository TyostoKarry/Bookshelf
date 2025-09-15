package io.github.tyostokarry.bookshelf.controller.dto

import io.github.tyostokarry.bookshelf.entity.BookStatus
import io.github.tyostokarry.bookshelf.entity.Genre
import io.github.tyostokarry.bookshelf.entity.Language
import java.time.LocalDate

data class BookDto(
    val id: Long,
    val bookshelfId: Long,
    val title: String,
    val author: String,
    val pages: Int?,
    val coverUrl: String?,
    val description: String?,
    val publisher: String?,
    val publishedDate: LocalDate?,
    val isbn13: String?,
    val googleId: String?,
    val genre: Genre,
    val language: Language,
    val status: BookStatus,
    val progress: Int?,
    val startedAt: LocalDate?,
    val finishedAt: LocalDate?,
    val readCount: Int,
    val rating: Int?,
    val notes: String?,
    val favorite: Boolean,
)

data class CreateBookDto(
    val title: String,
    val author: String,
    val pages: Int?,
    val coverUrl: String?,
    val description: String?,
    val publisher: String?,
    val publishedDate: LocalDate?,
    val isbn13: String?,
    val googleId: String?,
    val genre: Genre = Genre.UNKNOWN,
    val language: Language = Language.UNKNOWN,
    val status: BookStatus = BookStatus.WISHLIST,
    val progress: Int?,
    val startedAt: LocalDate?,
    val finishedAt: LocalDate?,
    val readCount: Int = 0,
    val rating: Int?,
    val notes: String?,
    val favorite: Boolean = false,
)

data class UpdateBookDto(
    val title: String? = null,
    val author: String? = null,
    val pages: Int? = null,
    val coverUrl: String? = null,
    val description: String? = null,
    val publisher: String? = null,
    val publishedDate: LocalDate? = null,
    val isbn13: String? = null,
    val googleId: String? = null,
    val genre: Genre? = null,
    val language: Language? = null,
    val status: BookStatus? = null,
    val progress: Int? = null,
    val startedAt: LocalDate? = null,
    val finishedAt: LocalDate? = null,
    val readCount: Int? = null,
    val rating: Int? = null,
    val notes: String? = null,
    val favorite: Boolean? = null,
)
