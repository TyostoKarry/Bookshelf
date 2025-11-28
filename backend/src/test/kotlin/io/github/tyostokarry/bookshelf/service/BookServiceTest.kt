package io.github.tyostokarry.bookshelf.service

import io.github.tyostokarry.bookshelf.entity.Book
import io.github.tyostokarry.bookshelf.error.BookError
import io.github.tyostokarry.bookshelf.repository.BookRepository
import org.junit.jupiter.api.Nested
import org.junit.jupiter.api.Test
import org.mockito.kotlin.any
import org.mockito.kotlin.given
import org.mockito.kotlin.mock
import java.time.LocalDate
import java.util.Optional
import kotlin.test.assertEquals
import kotlin.test.assertTrue

class BookServiceTest {
    private val bookRepository: BookRepository = mock()
    private val bookService = BookService(bookRepository)

    @Nested
    inner class GetAllBooks {
        @Test
        fun `getAllBooks returns list of all books`() {
            val books =
                listOf(
                    Book(id = 1L, bookshelfId = 1L, title = "Test Book 1", author = "Author 1"),
                    Book(id = 2L, bookshelfId = 1L, title = "Test Book 2", author = "Author 2"),
                )
            given(bookRepository.findAll()).willReturn(books)

            val result = bookService.getAllBooks()

            assertEquals(2, result.size, "Expected two books to be returned")
            assertEquals(books, result, "Returned list should match repository output")
        }
    }

    @Nested
    inner class GetBookById {
        @Test
        fun `getBookById returns Right when book found`() {
            val book = Book(id = 1L, bookshelfId = 5L, title = "Test book", author = "Test author")
            given(bookRepository.findById(book.id)).willReturn(Optional.of(book))

            val result = bookService.getBookById(book.id)

            assertTrue(result.isRight(), "Expected a Right result")
            assertEquals(book, result.getOrNull(), "Returned book should match found one")
        }

        @Test
        fun `getBookById returns Left when not found`() {
            given(bookRepository.findById(999L)).willReturn(Optional.empty())

            val result = bookService.getBookById(999L)

            assertTrue(result.isLeft(), "Expected a Left result")
            assertEquals(BookError.NotFound(999L), result.leftOrNull(), "Expected book NotFound error variant")
        }
    }

    @Nested
    inner class GetBooksByBookshelf {
        @Test
        fun `getBooksByBookshelf returns all books belonging to shelf`() {
            val bookshelfId = 10L
            val books =
                listOf(
                    Book(id = 1L, bookshelfId = bookshelfId, title = "Book 1", author = "A"),
                    Book(id = 2L, bookshelfId = bookshelfId, title = "Book 2", author = "B"),
                )
            given(bookRepository.findByBookshelfId(bookshelfId)).willReturn(books)

            val result = bookService.getBooksByBookshelf(bookshelfId)

            assertEquals(2, result.size, "Expected exactly two books for shelf 10")
            assertEquals(books, result, "Books returned should match repository output")
        }
    }

    @Nested
    inner class SaveBook {
        @Test
        fun `saveBook saves book and returns persisted entity`() {
            val unsaved = Book(bookshelfId = 5L, title = "Test title", author = "Test author")
            val saved = unsaved.copy(id = 99L)
            given(bookRepository.save(any<Book>())).willReturn(saved)

            val result = bookService.saveBook(unsaved)

            assertEquals(99L, result.id, "Saved book should have id 99")
            assertEquals("Test title", result.title, "Saved book title should match")
            assertEquals("Test author", result.author, "Saved book author should match")
        }
    }

    @Nested
    inner class SaveAllBooks {
        @Test
        fun `saveAllBooks saves list and returns persisted entities`() {
            val unsaved =
                listOf(
                    Book(bookshelfId = 5L, title = "Title 1", author = "Author 1"),
                    Book(bookshelfId = 5L, title = "Title 2", author = "Author 2"),
                )
            val saved = unsaved.mapIndexed { index, book -> book.copy(id = (index + 1).toLong()) }
            given(bookRepository.saveAll(unsaved)).willReturn(saved)

            val result = bookService.saveAllBooks(unsaved)

            assertEquals(saved, result, "Saved books should match the returned result")
            assertEquals(2, result.size, "Saved book count should equal to 2")
        }
    }

    @Nested
    inner class UpdateBook {
        @Test
        fun `updateBook updates fields and returns Right`() {
            val existingBook =
                Book(
                    id = 1L,
                    bookshelfId = 10L,
                    title = "Old title",
                    author = "Old author",
                    progress = 100,
                    publishedDate = LocalDate.of(2020, 1, 1),
                )
            val updatedBook =
                existingBook.copy(
                    title = "New title",
                    author = "New author",
                    progress = 200,
                )
            given(bookRepository.findById(existingBook.id)).willReturn(Optional.of(existingBook))
            given(bookRepository.save(any<Book>())).willReturn(updatedBook)

            val result = bookService.updateBook(existingBook.id, updatedBook)

            assertTrue(result.isRight(), "Expected Right result after update")
            assertEquals("New title", result.getOrNull()?.title, "Updated book title should match")
            assertEquals("New author", result.getOrNull()?.author, "Updated book author should match")
            assertEquals(200, result.getOrNull()?.progress, "Updated book progress should match")
            assertEquals(existingBook.publishedDate, result.getOrNull()?.publishedDate, "Updated book publish date should remain as old")
        }

        @Test
        fun `updateBook returns Left when book not found`() {
            given(bookRepository.findById(999L)).willReturn(Optional.empty())

            val updated = Book(bookshelfId = 1L, title = "Updated title", author = "Updated author")
            val result = bookService.updateBook(999L, updated)

            assertTrue(result.isLeft(), "Expected Left when book missing")
            assertEquals(BookError.NotFound(999L), result.leftOrNull(), "Expected book NotFound error variant")
        }
    }

    @Nested
    inner class DeleteBook {
        @Test
        fun `deleteBook deletes successfully when found`() {
            given(bookRepository.existsById(1L)).willReturn(true)

            val result = bookService.deleteBook(1L)

            assertTrue(result.isRight(), "Expected Right result after update")
        }

        @Test
        fun `deleteBook returns Left when not found`() {
            given(bookRepository.existsById(999L)).willReturn(false)

            val result = bookService.deleteBook(999L)

            assertTrue(result.isLeft(), "Expected Left when book missing")
            assertEquals(BookError.NotFound(999L), result.leftOrNull(), "Expected book NotFound error variant")
        }
    }

    @Nested
    inner class DeleteBooksInBookshelf {
        @Test
        fun `deleteBooksInBookshelf deletes all books for shelf and returns count`() {
            given(bookRepository.deleteByBookshelfId(10L)).willReturn(3L)

            val result = bookService.deleteBooksInBookshelf(10L)

            assertEquals(3L, result, "Expected result to indicate 3 deleted books")
        }
    }
}
