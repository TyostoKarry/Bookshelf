package io.github.tyostokarry.bookshelf.controller.dto

import jakarta.validation.constraints.NotBlank
import jakarta.validation.constraints.Size
import java.time.LocalDateTime

data class BookshelfDto(
    val id: Long,
    val name: String,
    val description: String?,
    val createdAt: LocalDateTime,
    val updatedAt: LocalDateTime,
)

data class BookshelfWithTokenDto(
    val id: Long,
    val name: String,
    val description: String?,
    val createdAt: LocalDateTime,
    val updatedAt: LocalDateTime,
    val editToken: String,
)

data class CreateBookshelfDto(
    @field:NotBlank(message = "Bookshelf name is required")
    @field:Size(max = 100, message = "Bookshelf name must be at most 100 characters")
    val name: String,
    @field:Size(max = 1000, message = "Description must be at most 1000 characters")
    val description: String?,
)

data class UpdateBookshelfDto(
    @field:Size(max = 100, message = "Bookshelf name must be at most 100 characters")
    val name: String?,
    @field:Size(max = 1000, message = "Description must be at most 1000 characters")
    val description: String?,
)

data class DeleteBookshelfResult(
    val deletedBookshelfId: Long,
    val deletedBooks: Long,
)
