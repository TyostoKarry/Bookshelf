package io.github.tyostokarry.bookshelf.error

sealed class BookError {
    data class NotFound(
        val id: Long,
    ) : BookError()
}
