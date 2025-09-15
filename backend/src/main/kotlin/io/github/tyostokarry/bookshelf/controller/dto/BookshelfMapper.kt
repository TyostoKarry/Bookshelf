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

fun CreateBookshelfDto.toEntity() =
    Bookshelf(
        name = name,
        description = description,
    )

fun UpdateBookshelfDto.applyTo(bookshelf: Bookshelf): Bookshelf {
    name?.let { bookshelf.name = it }
    description?.let { bookshelf.description = it }

    return bookshelf
}
