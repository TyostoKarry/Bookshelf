package io.github.tyostokarry.bookshelf.error

sealed class BookshelfError {
    data class NotFoundByPublicId(
        val publicId: String,
    ) : BookshelfError()

    data class NotFoundByToken(
        val token: String,
    ) : BookshelfError()
}
