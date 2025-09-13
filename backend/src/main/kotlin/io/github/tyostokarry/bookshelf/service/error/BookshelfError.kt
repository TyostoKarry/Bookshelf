package io.github.tyostokarry.bookshelf.service.error

sealed class BookshelfError {
    data class NotFound(
        val id: Long,
    ) : BookshelfError()
}
