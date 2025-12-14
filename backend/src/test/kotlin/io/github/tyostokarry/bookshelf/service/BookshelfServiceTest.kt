package io.github.tyostokarry.bookshelf.service

import io.github.tyostokarry.bookshelf.entity.Bookshelf
import io.github.tyostokarry.bookshelf.error.BookshelfError
import io.github.tyostokarry.bookshelf.repository.BookshelfRepository
import io.github.tyostokarry.bookshelf.security.TokenHasher
import org.junit.jupiter.api.Nested
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.assertDoesNotThrow
import org.mockito.kotlin.any
import org.mockito.kotlin.given
import org.mockito.kotlin.mock
import java.util.Optional
import java.util.UUID
import kotlin.test.assertEquals
import kotlin.test.assertFalse
import kotlin.test.assertTrue

class BookshelfServiceTest {
    private val bookService: BookService = mock()
    private val bookshelfRepository: BookshelfRepository = mock()
    private val tokenHasher = mock<TokenHasher>()
    private val bookshelfService = BookshelfService(bookService, bookshelfRepository, tokenHasher)

    @Nested
    inner class GetAllBookshelves {
        @Test
        fun `getAllBookshelves returns list of shelves`() {
            val bookshelves =
                listOf(
                    Bookshelf(id = 1L, name = "My Shelf", description = "desc 1", publicId = "publicID", editTokenHash = "editTokenHash"),
                    Bookshelf(
                        id = 2L,
                        name = "Another Shelf",
                        description = "desc 2",
                        publicId = "publicID",
                        editTokenHash = "editTokenHash",
                    ),
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
            val bookshelf =
                Bookshelf(id = 1L, publicId = "publicID", name = "Test bookshelf", editTokenHash = "editTokenHash")
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
            assertEquals(BookshelfError.NotFoundById(999L), result.leftOrNull(), "Expected bookshelf NotFoundById error variant")
        }
    }

    @Nested
    inner class GetBookshelfByPublicId {
        @Test
        fun `getBookshelfByPublicId returns Right when found`() {
            val bookshelf = Bookshelf(id = 1L, publicId = "publicID", name = "Test bookshelf", editTokenHash = "editTokenHash")
            given(bookshelfRepository.findByPublicId(bookshelf.publicId)).willReturn(bookshelf)

            val result = bookshelfService.getBookshelfByPublicId(bookshelf.publicId)

            assertTrue(result.isRight(), "Expected Right result when found")
            assertEquals(bookshelf, result.getOrNull(), "Returned bookshelf should match")
        }

        @Test
        fun `getBookshelfByPublicId returns Left when not found`() {
            given(bookshelfRepository.findByPublicId("invalidId")).willReturn(null)

            val result = bookshelfService.getBookshelfByPublicId("invalidId")

            assertTrue(result.isLeft(), "Expected Left result when not found")
            assertEquals(
                BookshelfError.NotFoundByPublicId("invalidId"),
                result.leftOrNull(),
                "Expected bookshelf NotFoundByPublicId error variant",
            )
        }
    }

    @Nested
    inner class GetBookshelfByToken {
        @Test
        fun `getBookshelfByToken returns Right when found`() {
            val publicId = "publicID"
            val rawEditToken = "$publicId.editToken"
            val bookshelf = Bookshelf(id = 1L, name = "Test bookshelf", publicId = publicId, editTokenHash = "editTokenHash")

            given(bookshelfRepository.findByPublicId(bookshelf.publicId)).willReturn(bookshelf)
            given(tokenHasher.match(rawEditToken, bookshelf.editTokenHash)).willReturn(true)

            val result = bookshelfService.getBookshelfByToken(rawEditToken)

            assertTrue(result.isRight(), "Expected Right when shelf with token exists")
            assertEquals(bookshelf, result.getOrNull(), "Returned bookshelf should match repository output")
        }

        @Test
        fun `getBookshelfByToken returns Left when invalid token`() {
            val publicId = "publicID"
            val bookshelf = Bookshelf(id = 1L, name = "Test bookshelf", publicId = publicId, editTokenHash = "editTokenHash")

            given(bookshelfRepository.findByPublicId(bookshelf.publicId)).willReturn(bookshelf)
            given(tokenHasher.match("$publicId.notValidToken", bookshelf.editTokenHash)).willReturn(false)

            val result = bookshelfService.getBookshelfByToken("$publicId.notValidToken")

            assertTrue(result.isLeft(), "Expected Left result when invalid edit token")
            assertEquals(
                BookshelfError.NotFoundByToken("$publicId.notValidToken"),
                result.leftOrNull(),
                "Expected bookshelf NotFoundByToken error variant",
            )
        }

        @Test
        fun `getBookshelfByToken returns Left when bookshelf not found`() {
            val nonExistentPublicId = "invalidPublicId"
            given(bookshelfRepository.findByPublicId(nonExistentPublicId)).willReturn(null)

            val result = bookshelfService.getBookshelfByToken("$nonExistentPublicId.notValidToken")

            assertTrue(result.isLeft(), "Expected Left result when invalid edit token")
            assertEquals(
                BookshelfError.NotFoundByPublicId(nonExistentPublicId),
                result.leftOrNull(),
                "Expected bookshelf NotFoundByPublicId error variant",
            )
        }
    }

    @Nested
    inner class CreateBookshelf {
        @Test
        fun `createBookshelf creates new entity with all required fields`() {
            val dtoName = "Test bookshelf"
            val dtoDescription = " Test desc"
            val editTokenHash = "editTokenHash"
            val savedBookshelf =
                Bookshelf(name = dtoName, description = dtoDescription, publicId = "publicID", editTokenHash = editTokenHash)

            given(tokenHasher.hash(any<String>())).willReturn(editTokenHash)
            given(bookshelfRepository.save(any<Bookshelf>())).willReturn(savedBookshelf)

            val (resultRawEditToken, resultBookshelf) = bookshelfService.createBookshelf(dtoName, dtoDescription)

            assertEquals(savedBookshelf, resultBookshelf, "Expected saved bookshelf to be returned")
            val parts = resultRawEditToken.split(".")
            assertEquals(2, parts.size, "Raw edit token should have 2 parts separated by ';'")
            assertTrue(parts[0].length in 20..22, "publicId part should look like a NanoId")
            assertDoesNotThrow("Second part should be a valid UUID") {
                UUID.fromString(parts[1])
            }
        }
    }

    @Nested
    inner class CreateBookshelfWithPublicId {
        @Test
        fun `createBookshelfWithPublicId creates new entity with all required fields`() {
            val publicId = "publicID"
            val dtoName = "Test bookshelf"
            val dtoDescription = " Test desc"
            val editTokenHash = "editTokenHash"
            val savedBookshelf =
                Bookshelf(name = dtoName, description = dtoDescription, publicId = publicId, editTokenHash = editTokenHash)

            given(tokenHasher.hash(any<String>())).willReturn(editTokenHash)
            given(bookshelfRepository.save(any<Bookshelf>())).willReturn(savedBookshelf)

            val (resultRawEditToken, resultBookshelf) = bookshelfService.createBookshelfWithPublicId(publicId, dtoName, dtoDescription)

            assertEquals(savedBookshelf, resultBookshelf, "Expected saved bookshelf to be returned")
            val parts = resultRawEditToken.split(".")
            assertEquals(2, parts.size, "Raw edit token should have 2 parts separated by ';'")
            assertEquals(publicId, parts[0], "publicId part should match the provided publicId")
            assertDoesNotThrow("Second part should be a valid UUID") {
                UUID.fromString(parts[1])
            }
        }
    }

    @Nested
    inner class VerifyToken {
        @Test
        fun `verifyToken returns true when tokens match`() {
            val validEditToken = "editToken"
            val bookshelf = Bookshelf(id = 1L, name = "Test bookshelf", publicId = "publicId", editTokenHash = "editTokenHash")

            given(tokenHasher.match(validEditToken, bookshelf.editTokenHash)).willReturn(true)

            val result = bookshelfService.verifyToken(bookshelf, validEditToken)

            assertTrue(result, "verifyToken should return true when the provided token matches the stored hash")
        }

        @Test
        fun `verifyToken returns false when tokens do not match`() {
            val invalidEditToken = "invalidEditToken"
            val bookshelf = Bookshelf(id = 1L, name = "Test bookshelf", publicId = "publicId", editTokenHash = "editTokenHash")

            given(tokenHasher.match(invalidEditToken, bookshelf.editTokenHash)).willReturn(false)

            val result = bookshelfService.verifyToken(bookshelf, invalidEditToken)

            assertFalse(result, "verifyToken should return false when the provided token does not match the stored hash")
        }
    }

    @Nested
    inner class SaveBookshelf {
        @Test
        fun `saveBookshelf saves and returns persisted entity`() {
            val newBookshelf =
                Bookshelf(name = "Test bookshelf", description = "Test desc", publicId = "publicID", editTokenHash = "editTokenHash")
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
            val bookshelf = Bookshelf(id = 10L, publicId = "publicId", name = "My Shelf", editTokenHash = "editTokenHash")
            given(bookshelfRepository.findByPublicId(bookshelf.publicId)).willReturn(bookshelf)
            given(bookService.deleteBooksInBookshelf(bookshelf.id)).willReturn(5L)

            val result = bookshelfService.deleteBookshelf(bookshelf.publicId)

            assertTrue(result.isRight(), "Expected Right result when successful")
            assertEquals(5L, result.getOrNull(), "Expected result to reflect deleted book count")
        }

        @Test
        fun `deleteBookshelf returns Left when shelf not found`() {
            val nonExistentPublicId = "invalidPublicId"
            given(bookshelfRepository.findByPublicId(nonExistentPublicId)).willReturn(null)

            val result = bookshelfService.deleteBookshelf(nonExistentPublicId)

            assertTrue(result.isLeft(), "Expected Left when bookshelf does not exist")
            assertEquals(
                BookshelfError.NotFoundByPublicId(nonExistentPublicId),
                result.leftOrNull(),
                "Expected bookshelf NotFoundByPublicId error variant",
            )
        }
    }
}
