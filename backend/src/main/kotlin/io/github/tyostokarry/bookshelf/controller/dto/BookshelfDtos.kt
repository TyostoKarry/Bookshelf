package io.github.tyostokarry.bookshelf.controller.dto

import jakarta.validation.constraints.NotBlank
import jakarta.validation.constraints.Size
import java.time.LocalDateTime

/**
 * Basic bookshelf info for public or regular responses.
 */
data class BookshelfDto(
    val publicId: String,
    val name: String,
    val description: String?,
    val createdAt: LocalDateTime,
    val updatedAt: LocalDateTime,
)

/**
 * Bookshelf info that also exposes the edit token (used only after creation).
 */
data class BookshelfWithTokenDto(
    val publicId: String,
    val name: String,
    val description: String?,
    val createdAt: LocalDateTime,
    val updatedAt: LocalDateTime,
    val editToken: String,
)

/**
 * Payload for creating a new bookshelf.
 */
data class CreateBookshelfDto(
    @field:NotBlank(message = "Bookshelf name is required")
    @field:Size(max = 100, message = "Bookshelf name must be at most 100 characters")
    val name: String,
    @field:Size(max = 1000, message = "Description must be at most 1000 characters")
    val description: String?,
)

/**
 * Payload for updating an existing bookshelf.
 */
data class UpdateBookshelfDto(
    @field:Size(max = 100, message = "Bookshelf name must be at most 100 characters")
    val name: String?,
    @field:Size(max = 1000, message = "Description must be at most 1000 characters")
    val description: String?,
)

/**
 * Returned when deleting an entire bookshelf (for informational purposes).
 */
data class DeleteBookshelfResult(
    val deletedBookshelfPublicId: String,
    val deletedBooksCount: Long,
)
