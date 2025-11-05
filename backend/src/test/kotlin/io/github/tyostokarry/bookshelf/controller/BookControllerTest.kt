package io.github.tyostokarry.bookshelf.controller

import arrow.core.Either
import com.fasterxml.jackson.core.type.TypeReference
import com.fasterxml.jackson.databind.ObjectMapper
import io.github.tyostokarry.bookshelf.controller.advice.ApiResponse
import io.github.tyostokarry.bookshelf.controller.advice.ErrorCodes
import io.github.tyostokarry.bookshelf.controller.dto.BookDto
import io.github.tyostokarry.bookshelf.controller.dto.toDto
import io.github.tyostokarry.bookshelf.entity.Book
import io.github.tyostokarry.bookshelf.entity.Bookshelf
import io.github.tyostokarry.bookshelf.error.BookError
import io.github.tyostokarry.bookshelf.service.BookService
import io.github.tyostokarry.bookshelf.service.BookshelfService
import org.junit.jupiter.api.Nested
import org.junit.jupiter.api.Test
import org.mockito.kotlin.any
import org.mockito.kotlin.given
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest
import org.springframework.test.context.ActiveProfiles
import org.springframework.test.context.bean.override.mockito.MockitoBean
import org.springframework.test.web.servlet.MockMvc
import org.springframework.test.web.servlet.get
import kotlin.test.assertEquals
import kotlin.test.assertNotNull
import kotlin.test.assertNull

@ActiveProfiles("test")
@WebMvcTest(controllers = [BookController::class])
@AutoConfigureMockMvc(addFilters = false)
class BookControllerTest(
    @Autowired val mockMvc: MockMvc,
    @Autowired val objectMapper: ObjectMapper,
) {
    @MockitoBean
    lateinit var bookService: BookService

    @MockitoBean
    lateinit var bookshelfService: BookshelfService

    @Nested
    inner class GetAllBooks {
        @Test
        fun `Get all books returns list of BookDto`() {
            val bookshelf = Bookshelf(id = 1, publicId = "publicId", name = "Test Name")
            val books =
                listOf(
                    Book(id = 1, bookshelfId = 1, title = "Test Book 1", author = "Author One"),
                    Book(id = 2, bookshelfId = 1, title = "Test Book 2", author = "Author Two"),
                )
            given(bookService.getAllBooks()).willReturn(books)
            given(bookshelfService.getBookshelfById(any())).willReturn(Either.Right(bookshelf))

            val responseBody =
                mockMvc
                    .get("/api/v1/books")
                    .andExpect { status { isOk() } }
                    .andReturn()
                    .response
                    .contentAsString

            val typeRef = object : TypeReference<ApiResponse<List<BookDto>>>() {}
            val response: ApiResponse<List<BookDto>> = objectMapper.readValue(responseBody, typeRef)

            assertNotNull(response.data, "Response data should not be null")
            val responseData = response.data!!
            assertEquals(2, responseData.size, "Response should return two books")
            assertEquals(
                books.map { it.toDto(bookshelf.publicId) },
                responseData,
                "Response books should match expected DTO representations",
            )
            assertNull(response.error, "Response error should be null for successful response")
        }
    }

    @Nested
    inner class GetBookById {
        @Test
        fun `Get book returns BookDto when book is found`() {
            val bookshelf = Bookshelf(id = 1, publicId = "publicId", name = "Test Name")
            val book = Book(id = 10, bookshelfId = 5, title = "Test Book 1", author = "Author One")
            given(bookService.getBookById(book.id)).willReturn(Either.Right(book))
            given(bookshelfService.getBookshelfById(any())).willReturn(Either.Right(bookshelf))

            val responseBody =
                mockMvc
                    .get("/api/v1/books/10")
                    .andExpect { status { isOk() } }
                    .andReturn()
                    .response
                    .contentAsString

            val typeRef = object : TypeReference<ApiResponse<BookDto>>() {}
            val response: ApiResponse<BookDto> = objectMapper.readValue(responseBody, typeRef)

            assertNotNull(response.data, "Response data should not be null")
            val responseData = response.data!!
            assertEquals(book.toDto(bookshelf.publicId), responseData, "Response book should match expected DTO representation")
            assertNull(response.error, "Response error should be null for successful response")
        }

        @Test
        fun `Get book returns 404 when book not found`() {
            given(bookService.getBookById(999L)).willReturn(Either.Left(BookError.NotFound(999L)))

            val responseBody =
                mockMvc
                    .get("/api/v1/books/999")
                    .andExpect { status { isNotFound() } }
                    .andReturn()
                    .response
                    .contentAsString

            val typeRef = object : TypeReference<ApiResponse<BookError>>() {}
            val response: ApiResponse<BookError> = objectMapper.readValue(responseBody, typeRef)

            assertNotNull(response.error, "Response error should not be null")
            val responseError = response.error!!
            assertEquals("Book with id 999 not found", responseError.message, "Response error message should indicate unfound book")
            assertEquals(ErrorCodes.BOOK_NOT_FOUND, responseError.code, "Response error code should indicate book not found")
            assertNull(response.data, "Response data should be null for unsuccessful response")
        }
    }
}
