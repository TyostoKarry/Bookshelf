package io.github.tyostokarry.bookshelf.service

import arrow.core.Either
import arrow.core.left
import arrow.core.right
import io.github.oshai.kotlinlogging.KotlinLogging
import io.github.tyostokarry.bookshelf.entity.Book
import io.github.tyostokarry.bookshelf.error.BookError
import io.github.tyostokarry.bookshelf.repository.BookRepository
import io.github.tyostokarry.bookshelf.util.logContext
import org.springframework.data.repository.findByIdOrNull
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional

@Service
class BookService(
    private val bookRepository: BookRepository,
) {
    private val logger = KotlinLogging.logger {}

    fun getAllBooks(): List<Book> = bookRepository.findAll()

    fun getBookById(id: Long): Either<BookError, Book> =
        bookRepository.findByIdOrNull(id)?.right()
            ?: run {
                logger.warn { "${logContext("getBookById")} Book not found: id=$id" }
                BookError.NotFound(id).left()
            }

    fun getBooksByBookshelf(bookshelfId: Long): List<Book> = bookRepository.findByBookshelfId(bookshelfId)

    fun saveBook(book: Book): Book {
        val savedBook = bookRepository.save(book)
        logger.info { "${logContext("saveBook")} Created book: id=${savedBook.id}, bookshelfId=${savedBook.bookshelfId}" }
        return savedBook
    }

    @Transactional
    fun saveAllBooks(books: List<Book>): List<Book> {
        val savedBooks = bookRepository.saveAll(books)
        logger.info { "${logContext("saveAllBooks")} Created ${savedBooks.size} books" }
        return savedBooks
    }

    @Transactional
    fun updateBook(
        id: Long,
        updatedBook: Book,
    ): Either<BookError, Book> {
        val existingBook =
            bookRepository.findByIdOrNull(id)
                ?: run {
                    logger.warn { "${logContext("updateBook")} Update failed — book not found: id=$id" }
                    return BookError.NotFound(id).left()
                }
        logger.info { "${logContext("updateBook")} Updating book: id=$id" }
        existingBook.apply {
            title = updatedBook.title
            author = updatedBook.author
            pages = updatedBook.pages
            coverUrl = updatedBook.coverUrl
            description = updatedBook.description
            publisher = updatedBook.publisher
            publishedDate = updatedBook.publishedDate
            isbn13 = updatedBook.isbn13
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
            logger.info { "${logContext("deleteBook")} Deleted book: id=$id" }
            id.right()
        } else {
            logger.warn { "${logContext("deleteBook")} Delete failed — book not found: id=$id" }
            BookError.NotFound(id).left()
        }

    @Transactional
    fun deleteBooksInBookshelf(bookshelfId: Long): Long {
        val deleteCount = bookRepository.deleteByBookshelfId(bookshelfId)
        logger.info { "${logContext("deleteBooksInBookshelf")} Deleted $deleteCount books: bookshelfId=$bookshelfId" }
        return deleteCount
    }
}
