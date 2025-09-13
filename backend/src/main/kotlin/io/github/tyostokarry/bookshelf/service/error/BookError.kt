package io.github.tyostokarry.bookshelf.service.error

sealed class BookError {
    data class NotFound(
        val id: Long,
    ) : BookError()
}
