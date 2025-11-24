package io.github.tyostokarry.bookshelf.controller.dto

import io.github.tyostokarry.bookshelf.entity.Bookshelf

fun Bookshelf.toBookshelfDto() =
    BookshelfDto(
        publicId = this.publicId,
        name = this.name,
        description = this.description,
        createdAt = this.createdAt,
        updatedAt = this.updatedAt,
    )

fun Bookshelf.toBookshelfWithTokenDto(rawEditToken: String) =
    BookshelfWithTokenDto(
        publicId = this.publicId,
        name = this.name,
        description = this.description,
        createdAt = this.createdAt,
        updatedAt = this.updatedAt,
        editToken = rawEditToken,
    )

fun UpdateBookshelfDto.applyTo(bookshelf: Bookshelf): Bookshelf {
    name?.let { bookshelf.name = it }
    bookshelf.description = this.description

    return bookshelf
}
