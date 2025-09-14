package io.github.tyostokarry.bookshelf.controller.dto

import java.time.LocalDateTime

data class BookshelfWithTokenDto(
    val id: Long,
    val name: String,
    val description: String?,
    val createdAt: LocalDateTime,
    val updatedAt: LocalDateTime,
    val editToken: String,
)
