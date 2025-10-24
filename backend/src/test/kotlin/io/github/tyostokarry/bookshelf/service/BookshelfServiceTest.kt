package io.github.tyostokarry.bookshelf.service

import io.github.tyostokarry.bookshelf.entity.Bookshelf
import io.github.tyostokarry.bookshelf.repository.BookshelfRepository
import io.github.tyostokarry.bookshelf.service.error.BookshelfError
import org.junit.jupiter.api.Nested
import org.junit.jupiter.api.Test
import org.mockito.kotlin.any
import org.mockito.kotlin.given
import org.mockito.kotlin.mock
import java.util.Optional
import kotlin.test.assertEquals
import kotlin.test.assertTrue

class BookshelfServiceTest {
    private val bookService: BookService = mock()
    private val bookshelfRepository: BookshelfRepository = mock()
    private val bookshelfService = BookshelfService(bookService, bookshelfRepository)

    @Nested
    inner class GetAllBookshelves {
        @Test
        fun `getAllBookshelves returns list of shelves`() {
            val bookshelves =
                listOf(
                    Bookshelf(id = 1L, name = "My Shelf", description = "desc 1"),
                    Bookshelf(id = 2L, name = "Another Shelf", description = "desc 2"),
                )
            given(bookshelfRepository.findAll()).willReturn(bookshelves)

            val result = bookshelfService.getAllBookshelves()

            assertEquals(2, result.size, "Expected two bookshelves to be returned")
            assertEquals(bookshelves, result, "Returned list should match repository output")
        }
    }

    @Nested
    inner class GetBookshelfById {
        @Test
        fun `getBookshelfById returns Right when found`() {
            val bookshelf = Bookshelf(id = 1L, name = "Test bookshelf")
            given(bookshelfRepository.findById(bookshelf.id)).willReturn(Optional.of(bookshelf))

            val result = bookshelfService.getBookshelfById(bookshelf.id)

            assertTrue(result.isRight(), "Expected Right result when found")
            assertEquals(bookshelf, result.getOrNull(), "Returned bookshelf should match")
        }

        @Test
        fun `getBookshelfById returns Left when not found`() {
            given(bookshelfRepository.findById(999L)).willReturn(Optional.empty())

            val result = bookshelfService.getBookshelfById(999L)

            assertTrue(result.isLeft(), "Expected Left result when not found")
            assertEquals(BookshelfError.NotFound(999L), result.leftOrNull(), "Expected bookshelf NotFound error variant")
        }
    }

    @Nested
    inner class GetBookshelfByToken {
        @Test
        fun `getBookshelfByToken returns Right when found`() {
            val bookshelf = Bookshelf(id = 1L, name = "Test bookshelf", editToken = "testEditToken123")
            given(bookshelfRepository.findByEditToken(bookshelf.editToken)).willReturn(bookshelf)

            val result = bookshelfService.getBookshelfByToken(bookshelf.editToken)

            assertTrue(result.isRight(), "Expected Right when shelf with token exists")
            assertEquals(bookshelf, result.getOrNull(), "Returned bookshelf should match repository output")
        }

        @Test
        fun `getBookshelfByToken returns Left when not found`() {
            given(bookshelfRepository.findByEditToken("notValidToken")).willReturn(null)

            val result = bookshelfService.getBookshelfByToken("notValidToken")

            assertTrue(result.isLeft(), "Expected Left result when invalid edit token")
            assertEquals(
                BookshelfError.NotFoundByToken("notValidToken"),
                result.leftOrNull(),
                "Expected bookshelf NotFoundByToken error variant",
            )
        }
    }

    @Nested
    inner class SaveBookshelf {
        @Test
        fun `saveBookshelf saves and returns persisted entity`() {
            val newBookshelf = Bookshelf(name = "Test bookshelf", description = "Test desc")
            val savedBookshelf = newBookshelf.copy(id = 100L)
            given(bookshelfRepository.save(any<Bookshelf>())).willReturn(savedBookshelf)

            val result = bookshelfService.saveBookshelf(newBookshelf)

            assertEquals(savedBookshelf, result, "Expected saved bookshelf to be returned")
        }
    }

    @Nested
    inner class DeleteBookshelf {
        @Test
        fun `deleteBookshelf deletes shelf and its books when found`() {
            val bookshelfId = 10L
            given(bookshelfRepository.existsById(bookshelfId)).willReturn(true)
            given(bookService.deleteBooksInBookshelf(bookshelfId)).willReturn(5L)

            val result = bookshelfService.deleteBookshelf(bookshelfId)

            assertTrue(result.isRight(), "Expected Right result when successful")
            assertEquals(5L, result.getOrNull(), "Expected result to reflect deleted book count")
        }

        @Test
        fun `deleteBookshelf returns Left when shelf not found`() {
            val nonExistentId = 999L
            given(bookshelfRepository.existsById(nonExistentId)).willReturn(false)

            val result = bookshelfService.deleteBookshelf(nonExistentId)

            assertTrue(result.isLeft(), "Expected Left when bookshelf does not exist")
            assertEquals(BookshelfError.NotFound(nonExistentId), result.leftOrNull(), "Expected bookshelf NotFound error variant")
        }
    }
}
