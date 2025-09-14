package io.github.tyostokarry.bookshelf.service

import arrow.core.Either
import arrow.core.left
import arrow.core.right
import io.github.tyostokarry.bookshelf.entity.Bookshelf
import io.github.tyostokarry.bookshelf.repository.BookshelfRepository
import io.github.tyostokarry.bookshelf.service.error.BookshelfError
import org.springframework.data.repository.findByIdOrNull
import org.springframework.stereotype.Service

@Service
class BookshelfService(
    private val bookService: BookService,
    private val bookshelfRepository: BookshelfRepository,
) {
    fun getAllBookshelves(): List<Bookshelf> = bookshelfRepository.findAll()

    fun getBookshelfById(id: Long): Either<BookshelfError, Bookshelf> =
        bookshelfRepository.findByIdOrNull(id)?.right() ?: BookshelfError.NotFound(id).left()

    fun getBookshelfByToken(editToken: String): Either<BookshelfError, Bookshelf> =
        bookshelfRepository.findByEditToken(editToken)?.right() ?: BookshelfError.NotFoundByToken(editToken).left()

    fun saveBookshelf(bookshelf: Bookshelf): Bookshelf = bookshelfRepository.save(bookshelf)

    fun deleteBookshelf(id: Long): Either<BookshelfError, Long> =
        if (bookshelfRepository.existsById(id)) {
            val deleteCount = bookService.deleteBooksInBookshelf(id)
            bookshelfRepository.deleteById(id)
            deleteCount.right()
        } else {
            BookshelfError.NotFound(id).left()
        }
}
