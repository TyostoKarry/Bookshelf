package io.github.tyostokarry.bookshelf.service

import arrow.core.Either
import arrow.core.left
import arrow.core.right
import io.github.tyostokarry.bookshelf.entity.Bookshelf
import io.github.tyostokarry.bookshelf.error.BookshelfError
import io.github.tyostokarry.bookshelf.repository.BookshelfRepository
import org.springframework.data.repository.findByIdOrNull
import org.springframework.stereotype.Service

@Service
class BookshelfService(
    private val bookService: BookService,
    private val bookshelfRepository: BookshelfRepository,
) {
    fun getAllBookshelves(): List<Bookshelf> = bookshelfRepository.findAll()

    fun getBookshelfById(id: Long): Either<BookshelfError, Bookshelf> =
        bookshelfRepository.findByIdOrNull(id)?.right() ?: BookshelfError.NotFoundById(id).left()

    fun getBookshelfByPublicId(publicId: String): Either<BookshelfError, Bookshelf> =
        bookshelfRepository.findByPublicId(publicId)?.right() ?: BookshelfError.NotFoundByPublicId(publicId).left()

    fun getBookshelfByToken(editToken: String): Either<BookshelfError, Bookshelf> =
        bookshelfRepository.findByEditToken(editToken)?.right() ?: BookshelfError.NotFoundByToken(editToken).left()

    fun saveBookshelf(bookshelf: Bookshelf): Bookshelf = bookshelfRepository.save(bookshelf)

    fun deleteBookshelf(publicId: String): Either<BookshelfError, Long> {
        val bookshelf =
            bookshelfRepository.findByPublicId(publicId)
                ?: return BookshelfError.NotFoundByPublicId(publicId).left()

        val deleteCount = bookService.deleteBooksInBookshelf(bookshelf.id)
        bookshelfRepository.deleteById(bookshelf.id)
        return deleteCount.right()
    }
}
