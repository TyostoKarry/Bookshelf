package io.github.tyostokarry.bookshelf.controller.dto

import io.github.tyostokarry.bookshelf.entity.BookStatus
import io.github.tyostokarry.bookshelf.entity.Genre
import io.github.tyostokarry.bookshelf.entity.Language
import jakarta.validation.constraints.Max
import jakarta.validation.constraints.Min
import jakarta.validation.constraints.NotBlank
import jakarta.validation.constraints.Pattern
import jakarta.validation.constraints.Size
import java.time.LocalDate

/**
 * Basic book info for public or regular responses.
 */
data class BookDto(
    val id: Long,
    val bookshelfPublicId: String,
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

/**
 * Payload for creating a new book.
 */
data class CreateBookDto(
    @field:NotBlank(message = "Title is required")
    @field:Size(max = 255, message = "Title cannot exceed 255 characters")
    val title: String,
    @field:NotBlank(message = "Author is required")
    @field:Size(max = 255, message = "Author cannot exceed 255 characters")
    val author: String,
    @field:Min(1, message = "Pages must be at least 1")
    val pages: Int? = null,
    val coverUrl: String? = null,
    @field:Size(max = 1000, message = "Description must be at most 1000 characters")
    val description: String? = null,
    @field:Size(max = 100, message = "Publisher must be at most 100 characters")
    val publisher: String? = null,
    val publishedDate: LocalDate? = null,
    @field:Pattern(regexp = "\\d{13}", message = "ISBN must consist of exactly 13 numeric digits (0–9)")
    val isbn13: String? = null,
    val googleId: String? = null,
    val genre: Genre = Genre.UNKNOWN,
    val language: Language = Language.UNKNOWN,
    val status: BookStatus = BookStatus.WISHLIST,
    val progress: Int? = null,
    val startedAt: LocalDate? = null,
    val finishedAt: LocalDate? = null,
    @field:Min(0, message = "Read count cannot be negative")
    val readCount: Int = 0,
    @field:Min(0, message = "Rating must be between 0 and 10")
    @field:Max(10, message = "Rating must be between 0 and 10")
    val rating: Int? = null,
    @field:Size(max = 2000, message = "Notes must be at most 2000 characters")
    val notes: String? = null,
    val favorite: Boolean = false,
)

/**
 * Payload for updating an existing book.
 */
data class UpdateBookDto(
    @field:Size(min = 1, max = 255, message = "Title cannot be empty or exceed 255 characters")
    val title: String? = null,
    @field:Size(min = 1, max = 255, message = "Author cannot be empty or exceed 255 characters")
    val author: String? = null,
    @field:Min(1, message = "Pages must be at least 1")
    val pages: Int? = null,
    val coverUrl: String? = null,
    @field:Size(max = 1000, message = "Description must be at most 1000 characters")
    val description: String? = null,
    @field:Size(max = 100, message = "Publisher must be at most 100 characters")
    val publisher: String? = null,
    val publishedDate: LocalDate? = null,
    @field:Pattern(regexp = "\\d{13}", message = "ISBN must consist of exactly 13 numeric digits (0–9)")
    val isbn13: String? = null,
    val googleId: String? = null,
    val genre: Genre? = null,
    val language: Language? = null,
    val status: BookStatus? = null,
    val progress: Int? = null,
    val startedAt: LocalDate? = null,
    val finishedAt: LocalDate? = null,
    @field:Min(0, message = "Read count cannot be negative")
    val readCount: Int? = null,
    @field:Min(0, message = "Rating must be between 0 and 10")
    @field:Max(10, message = "Rating must be between 0 and 10")
    val rating: Int? = null,
    @field:Size(max = 2000, message = "Notes must be at most 2000 characters")
    val notes: String? = null,
    val favorite: Boolean? = null,
)
