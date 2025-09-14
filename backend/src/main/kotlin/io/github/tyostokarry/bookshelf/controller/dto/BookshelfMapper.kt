package io.github.tyostokarry.bookshelf.controller.dto

import io.github.tyostokarry.bookshelf.entity.Bookshelf

fun Bookshelf.toBookshelfDto() =
    BookshelfDto(
        id = this.id,
        name = this.name,
        description = this.description,
        createdAt = this.createdAt,
        updatedAt = this.updatedAt,
    )

fun Bookshelf.toBookshelfWithTokenDto() =
    BookshelfWithTokenDto(
        id = this.id,
        name = this.name,
        description = this.description,
        createdAt = this.createdAt,
        updatedAt = this.updatedAt,
        editToken = this.editToken,
    )
