package io.github.tyostokarry.bookshelf.service

import arrow.core.Either
import arrow.core.left
import arrow.core.right
import io.github.tyostokarry.bookshelf.entity.Book
import io.github.tyostokarry.bookshelf.error.BookError
import io.github.tyostokarry.bookshelf.repository.BookRepository
import org.springframework.data.repository.findByIdOrNull
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional

@Service
class BookService(
    private val bookRepository: BookRepository,
) {
    fun getAllBooks(): List<Book> = bookRepository.findAll()

    fun getBookById(id: Long): Either<BookError, Book> = bookRepository.findByIdOrNull(id)?.right() ?: BookError.NotFound(id).left()

    fun getBooksByBookshelf(bookshelfId: Long): List<Book> = bookRepository.findByBookshelfId(bookshelfId)

    fun saveBook(book: Book): Book = bookRepository.save(book)

    @Transactional
    fun updateBook(
        id: Long,
        updatedBook: Book,
    ): Either<BookError, Book> {
        val existingBook = bookRepository.findByIdOrNull(id) ?: return BookError.NotFound(id).left()
        existingBook.apply {
            title = updatedBook.title
            author = updatedBook.author
            pages = updatedBook.pages
            coverUrl = updatedBook.coverUrl
            description = updatedBook.description
            publisher = updatedBook.publisher
            publishedDate = updatedBook.publishedDate
            isbn13 = updatedBook.isbn13
            googleId = updatedBook.googleId
            genre = updatedBook.genre
            language = updatedBook.language
            status = updatedBook.status
            progress = updatedBook.progress
            startedAt = updatedBook.startedAt
            finishedAt = updatedBook.finishedAt
            readCount = updatedBook.readCount
            rating = updatedBook.rating
            notes = updatedBook.notes
            favorite = updatedBook.favorite
        }
        return bookRepository.save(existingBook).right()
    }

    @Transactional
    fun deleteBook(id: Long): Either<BookError, Long> =
        if (bookRepository.existsById(id)) {
            bookRepository.deleteById(id)
            id.right()
        } else {
            BookError.NotFound(id).left()
        }

    @Transactional
    fun deleteBooksInBookshelf(bookshelfId: Long): Long = bookRepository.deleteByBookshelfId(bookshelfId)
}
