package io.github.tyostokarry.bookshelf.controller

import arrow.core.Either
import com.fasterxml.jackson.core.type.TypeReference
import com.fasterxml.jackson.databind.ObjectMapper
import io.github.tyostokarry.bookshelf.controller.advice.ApiResponse
import io.github.tyostokarry.bookshelf.controller.advice.ErrorCodes
import io.github.tyostokarry.bookshelf.controller.advice.ErrorResponse
import io.github.tyostokarry.bookshelf.controller.dto.BookDto
import io.github.tyostokarry.bookshelf.controller.dto.BookshelfDto
import io.github.tyostokarry.bookshelf.controller.dto.BookshelfWithTokenDto
import io.github.tyostokarry.bookshelf.controller.dto.CreateBookDto
import io.github.tyostokarry.bookshelf.controller.dto.CreateBookshelfDto
import io.github.tyostokarry.bookshelf.controller.dto.DeleteBookshelfResult
import io.github.tyostokarry.bookshelf.controller.dto.UpdateBookDto
import io.github.tyostokarry.bookshelf.controller.dto.UpdateBookshelfDto
import io.github.tyostokarry.bookshelf.controller.dto.toBookshelfDto
import io.github.tyostokarry.bookshelf.controller.dto.toBookshelfWithTokenDto
import io.github.tyostokarry.bookshelf.controller.dto.toDto
import io.github.tyostokarry.bookshelf.entity.Book
import io.github.tyostokarry.bookshelf.entity.Bookshelf
import io.github.tyostokarry.bookshelf.error.BookError
import io.github.tyostokarry.bookshelf.error.BookshelfError
import io.github.tyostokarry.bookshelf.service.BookService
import io.github.tyostokarry.bookshelf.service.BookshelfService
import org.junit.jupiter.api.Nested
import org.junit.jupiter.api.Test
import org.mockito.kotlin.any
import org.mockito.kotlin.eq
import org.mockito.kotlin.given
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest
import org.springframework.http.MediaType
import org.springframework.test.context.ActiveProfiles
import org.springframework.test.context.bean.override.mockito.MockitoBean
import org.springframework.test.web.servlet.MockMvc
import org.springframework.test.web.servlet.delete
import org.springframework.test.web.servlet.get
import org.springframework.test.web.servlet.post
import org.springframework.test.web.servlet.put
import kotlin.test.assertEquals
import kotlin.test.assertNotNull
import kotlin.test.assertNull

@ActiveProfiles("test")
@WebMvcTest(controllers = [BookshelfController::class])
@AutoConfigureMockMvc(addFilters = false)
class BookshelfControllerTest(
    @Autowired val mockMvc: MockMvc,
    @Autowired val objectMapper: ObjectMapper,
) {
    @MockitoBean
    lateinit var bookshelfService: BookshelfService

    @MockitoBean
    lateinit var bookService: BookService

    @Nested
    inner class GetAllBookshelves {
        @Test
        fun `GET returns all bookshelves`() {
            val bookshelves =
                listOf(
                    Bookshelf(
                        id = 1,
                        name = "Test Bookshelf 1",
                        description = "desc 1",
                        publicId = "publicID",
                        editTokenHash = "editTokenHash",
                    ),
                    Bookshelf(
                        id = 2,
                        name = "Test Bookshelf 2",
                        description = "desc 2",
                        publicId = "publicID",
                        editTokenHash = "editTokenHash",
                    ),
                )
            given(bookshelfService.getAllBookshelves()).willReturn(bookshelves)

            val responseBody =
                mockMvc
                    .get("/api/v1/bookshelves")
                    .andExpect { status { isOk() } }
                    .andReturn()
                    .response
                    .contentAsString

            val type = object : TypeReference<ApiResponse<List<BookshelfDto>>>() {}
            val response: ApiResponse<List<BookshelfDto>> = objectMapper.readValue(responseBody, type)

            assertNotNull(response.data, "Response data should not be null")
            val responseData = response.data!!
            assertEquals(2, responseData.size, "Response should return two bookshelves")
            assertEquals(
                bookshelves.map { it.toBookshelfDto() },
                responseData,
                "Response bookshelves should match expected DTO representations",
            )
            assertNull(response.error, "Response error should be null for successful response")
        }
    }

    @Nested
    inner class GetBookshelfById {
        @Test
        fun `Get bookshelf by id returns BookshelfDto when successful`() {
            val bookshelf =
                Bookshelf(id = 10, publicId = "publicId", name = "Test Bookshelf", description = "desc", editTokenHash = "editTokenHash")
            given(bookshelfService.getBookshelfByPublicId(bookshelf.publicId)).willReturn(Either.Right(bookshelf))

            val responseBody =
                mockMvc
                    .get("/api/v1/bookshelves/publicId")
                    .andExpect { status { isOk() } }
                    .andReturn()
                    .response
                    .contentAsString

            val type = object : TypeReference<ApiResponse<BookshelfDto>>() {}
            val response: ApiResponse<BookshelfDto> = objectMapper.readValue(responseBody, type)

            assertNotNull(response.data, "Response data should not be null")
            val responseData = response.data!!
            assertEquals(
                bookshelf.toBookshelfDto(),
                responseData,
                "Response bookshelf should match expected DTO representation",
            )
            assertNull(response.error, "Response error should be null for successful response")
        }

        @Test
        fun `Get bookshelf by id returns 404 when bookshelf not found`() {
            given(
                bookshelfService.getBookshelfByPublicId("invalidId"),
            ).willReturn(Either.Left(BookshelfError.NotFoundByPublicId("invalidId")))

            val responseBody =
                mockMvc
                    .get("/api/v1/bookshelves/invalidId")
                    .andExpect { status { isNotFound() } }
                    .andReturn()
                    .response
                    .contentAsString

            val typeRef = object : TypeReference<ApiResponse<BookshelfError>>() {}
            val response: ApiResponse<BookshelfError> = objectMapper.readValue(responseBody, typeRef)

            assertNotNull(response.error, "Response error should not be null")
            val responseError = response.error!!
            assertEquals(
                "Bookshelf with id invalidId not found",
                responseError.message,
                "Response error message should indicate unfound bookshelf",
            )
            assertEquals(ErrorCodes.BOOKSHELF_NOT_FOUND, responseError.code, "Response error code should indicate bookshelf not found")
            assertNull(response.data, "Response data should be null for unsuccessful response")
        }
    }

    @Nested
    inner class GetBookshelfByToken {
        @Test
        fun `Get bookshelf by token returns BookshelfDto when successful`() {
            val bookshelf =
                Bookshelf(id = 10, name = "Test Bookshelf", description = "desc", publicId = "publicID", editTokenHash = "editTokenHash")
            given(bookshelfService.getBookshelfByToken("editToken")).willReturn(Either.Right(bookshelf))

            val responseBody =
                mockMvc
                    .get("/api/v1/bookshelves/token/editToken")
                    .andExpect { status { isOk() } }
                    .andReturn()
                    .response
                    .contentAsString

            val type = object : TypeReference<ApiResponse<BookshelfDto>>() {}
            val response: ApiResponse<BookshelfDto> = objectMapper.readValue(responseBody, type)

            assertNotNull(response.data, "Response data should not be null")
            val responseData = response.data!!
            assertEquals(
                bookshelf.toBookshelfDto(),
                responseData,
                "Response bookshelf should match expected DTO representation",
            )
            assertNull(response.error, "Response error should be null for successful response")
        }

        @Test
        fun `Get bookshelf by token returns 404 when bookshelf not found`() {
            given(
                bookshelfService.getBookshelfByToken("notValidToken"),
            ).willReturn(Either.Left(BookshelfError.NotFoundByToken("notValidToken")))

            val responseBody =
                mockMvc
                    .get("/api/v1/bookshelves/token/notValidToken")
                    .andExpect { status { isNotFound() } }
                    .andReturn()
                    .response
                    .contentAsString

            val typeRef = object : TypeReference<ApiResponse<BookshelfError>>() {}
            val response: ApiResponse<BookshelfError> = objectMapper.readValue(responseBody, typeRef)

            assertNotNull(response.error, "Response error should not be null")
            val responseError = response.error!!
            assertEquals(
                "Bookshelf with token notValidToken not found",
                responseError.message,
                "Response error message should indicate unfound bookshelf",
            )
            assertEquals(ErrorCodes.BOOKSHELF_NOT_FOUND, responseError.code, "Response error code should indicate bookshelf not found")
            assertNull(response.data, "Response data should be null for unsuccessful response")
        }
    }

    @Nested
    inner class GetBooksInBookshelf {
        @Test
        fun `Get books in bookshelf returns List of BookDtos when successful`() {
            val bookshelf =
                Bookshelf(id = 10, publicId = "publicId", name = "Test Bookshelf", description = "desc", editTokenHash = "editTokenHash")
            val books =
                listOf(
                    Book(bookshelfId = 10, title = "Test book 1", author = "Test author 1"),
                    Book(bookshelfId = 10, title = "Test book 2", author = "Test author 2"),
                )

            given(bookshelfService.getBookshelfByPublicId(bookshelf.publicId)).willReturn(Either.Right(bookshelf))
            given(bookService.getBooksByBookshelf(bookshelf.id)).willReturn(books)

            val responseBody =
                mockMvc
                    .get("/api/v1/bookshelves/publicId/books")
                    .andExpect { status { isOk() } }
                    .andReturn()
                    .response
                    .contentAsString

            val type = object : TypeReference<ApiResponse<List<BookDto>>>() {}
            val response: ApiResponse<List<BookDto>> = objectMapper.readValue(responseBody, type)

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

        @Test
        fun `Get books in bookshelf returns 404 when bookshelf not found`() {
            given(
                bookshelfService.getBookshelfByPublicId("invalidId"),
            ).willReturn(Either.Left(BookshelfError.NotFoundByPublicId("invalidId")))

            val responseBody =
                mockMvc
                    .get("/api/v1/bookshelves/invalidId/books")
                    .andExpect { status { isNotFound() } }
                    .andReturn()
                    .response
                    .contentAsString

            val typeRef = object : TypeReference<ApiResponse<BookshelfError>>() {}
            val response: ApiResponse<BookshelfError> = objectMapper.readValue(responseBody, typeRef)

            assertNotNull(response.error, "Response error should not be null")
            val responseError = response.error!!
            assertEquals(
                "Bookshelf with id invalidId not found",
                responseError.message,
                "Response error message should indicate unfound bookshelf",
            )
            assertEquals(ErrorCodes.BOOKSHELF_NOT_FOUND, responseError.code, "Response error code should indicate book not found")
            assertNull(response.data, "Response data should be null for unsuccessful response")
        }
    }

    @Nested
    inner class GetBooksInBookshelfByToken {
        @Test
        fun `Get books in bookshelf by token returns List of BookDtos when successful`() {
            val bookshelf =
                Bookshelf(id = 10, name = "Test Bookshelf", description = "desc", publicId = "publicID", editTokenHash = "editTokenHash")
            val books =
                listOf(
                    Book(bookshelfId = 10, title = "Test book 1", author = "Test author 1"),
                    Book(bookshelfId = 10, title = "Test book 2", author = "Test author 2"),
                )

            given(bookshelfService.getBookshelfByToken("editToken")).willReturn(Either.Right(bookshelf))
            given(bookService.getBooksByBookshelf(bookshelf.id)).willReturn(books)

            val responseBody =
                mockMvc
                    .get("/api/v1/bookshelves/token/editToken/books")
                    .andExpect { status { isOk() } }
                    .andReturn()
                    .response
                    .contentAsString

            val type = object : TypeReference<ApiResponse<List<BookDto>>>() {}
            val response: ApiResponse<List<BookDto>> = objectMapper.readValue(responseBody, type)

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

        @Test
        fun `Get books in bookshelf by token returns 404 when bookshelf not found`() {
            given(
                bookshelfService.getBookshelfByToken("notValidToken"),
            ).willReturn(Either.Left(BookshelfError.NotFoundByToken("notValidToken")))

            val responseBody =
                mockMvc
                    .get("/api/v1/bookshelves/token/notValidToken/books")
                    .andExpect { status { isNotFound() } }
                    .andReturn()
                    .response
                    .contentAsString

            val typeRef = object : TypeReference<ApiResponse<BookshelfError>>() {}
            val response: ApiResponse<BookshelfError> = objectMapper.readValue(responseBody, typeRef)

            assertNotNull(response.error, "Response error should not be null")
            val responseError = response.error!!
            assertEquals(
                "Bookshelf with token notValidToken not found",
                responseError.message,
                "Response error message should indicate unfound bookshelf",
            )
            assertEquals(ErrorCodes.BOOKSHELF_NOT_FOUND, responseError.code, "Response error code should indicate bookshelf not found")
            assertNull(response.data, "Response data should be null for unsuccessful response")
        }
    }

    @Nested
    inner class CreateBookshelf {
        @Test
        fun `Post bookshelf returns BookshelfWithTokenDto when successful`() {
            val rawEditToken = "editToken"
            val dto = CreateBookshelfDto(name = "New bookshelf", description = "Test bookshelf")
            val saved =
                Bookshelf(id = 99L, name = dto.name, description = dto.description, publicId = "publicID", editTokenHash = "editTokenHash")

            given(bookshelfService.createBookshelf(any(), any())).willReturn(Pair(rawEditToken, saved))

            val responseBody =
                mockMvc
                    .post("/api/v1/bookshelves") {
                        contentType = MediaType.APPLICATION_JSON
                        content = objectMapper.writeValueAsString(dto)
                    }.andExpect { status { isOk() } }
                    .andReturn()
                    .response
                    .contentAsString

            val typeRef = object : TypeReference<ApiResponse<BookshelfWithTokenDto>>() {}
            val response: ApiResponse<BookshelfWithTokenDto> = objectMapper.readValue(responseBody, typeRef)

            assertNotNull(response.data, "Response data should not be null")
            val responseData = response.data!!
            assertEquals(
                saved.toBookshelfWithTokenDto(rawEditToken),
                responseData,
                "Response bookshelf should match expected DTO representation",
            )
            assertNull(response.error, "Response error should be null for successful response")
        }

        @Test
        fun `Post bookshelf returns 400 Bad Request when bookshelf name is blank`() {
            val invalidDto = CreateBookshelfDto(name = "", description = "Test bookshelf")

            val responseBody =
                mockMvc
                    .post("/api/v1/bookshelves") {
                        contentType = MediaType.APPLICATION_JSON
                        content = objectMapper.writeValueAsString(invalidDto)
                    }.andExpect { status { isBadRequest() } }
                    .andReturn()
                    .response
                    .contentAsString

            val typeRef = object : TypeReference<ApiResponse<BookshelfError>>() {}
            val response: ApiResponse<BookshelfError> = objectMapper.readValue(responseBody, typeRef)

            assertNotNull(response.error, "Response error should not be null")
            val responseError = response.error!!
            assertEquals(
                "Validation failed",
                responseError.message,
                "Response error message should indicate failed validation",
            )
            assertEquals(
                "Bookshelf name is required",
                responseError.fieldErrors?.values?.first(),
                "Response field errors should indicate missing name field",
            )
            assertEquals(ErrorCodes.VALIDATION_ERROR, responseError.code, "Response error code should indicate validation error")
            assertNull(response.data, "Response data should be null for unsuccessful response")
        }
    }

    @Nested
    inner class CreateBook {
        @Test
        fun `Post book returns BookDto when successful`() {
            val bookshelf = Bookshelf(id = 10, publicId = "publicId", name = "Test bookshelf", editTokenHash = "editTokenHash")
            val dto = CreateBookDto(title = "New book", author = "Test author")
            val savedBook = Book(id = 10, bookshelfId = bookshelf.id, title = dto.title, author = dto.author)

            given(bookshelfService.getBookshelfByPublicId(bookshelf.publicId)).willReturn(Either.Right(bookshelf))
            given(bookshelfService.verifyToken(bookshelf, "editToken")).willReturn(true)
            given(bookService.saveBook(any())).willReturn(savedBook)

            val responseBody =
                mockMvc
                    .post("/api/v1/bookshelves/publicId/books") {
                        contentType = MediaType.APPLICATION_JSON
                        header(X_BOOKSHELF_TOKEN, "editToken")
                        content = objectMapper.writeValueAsString(dto)
                    }.andExpect { status { isOk() } }
                    .andReturn()
                    .response
                    .contentAsString

            val typeRef = object : TypeReference<ApiResponse<BookDto>>() {}
            val response: ApiResponse<BookDto> = objectMapper.readValue(responseBody, typeRef)

            assertNotNull(response.data, "Response data should not be null")
            val responseData = response.data!!
            assertEquals(savedBook.toDto(bookshelf.publicId), responseData, "Response book should match expected DTO representation")
            assertNull(response.error, "Response error should be null for successful response")
        }

        @Test
        fun `Post book returns 404 when bookshelf not found`() {
            val dto = CreateBookDto(title = "New book", author = "Test author")
            given(
                bookshelfService.getBookshelfByPublicId("invalidId"),
            ).willReturn(Either.Left(BookshelfError.NotFoundByPublicId("invalidId")))

            val responseBody =
                mockMvc
                    .post("/api/v1/bookshelves/invalidId/books") {
                        contentType = MediaType.APPLICATION_JSON
                        header(X_BOOKSHELF_TOKEN, "editToken")
                        content = objectMapper.writeValueAsString(dto)
                    }.andExpect { status { isNotFound() } }
                    .andReturn()
                    .response
                    .contentAsString

            val typeRef = object : TypeReference<ApiResponse<BookshelfError>>() {}
            val response: ApiResponse<BookshelfError> = objectMapper.readValue(responseBody, typeRef)

            assertNotNull(response.error, "Response error should not be null")
            val responseError = response.error!!
            assertEquals(
                "Bookshelf with id invalidId not found",
                responseError.message,
                "Response error message should indicate unfound bookshelf",
            )
            assertEquals(ErrorCodes.BOOKSHELF_NOT_FOUND, responseError.code, "Response error code should indicate bookshelf not found")
            assertNull(response.data, "Response data should be null for unsuccessful response")
        }

        @Test
        fun `Post book returns 400 Bad Request when title is blank`() {
            val invalidDto = CreateBookDto(title = "", author = "Test author")

            val responseBody =
                mockMvc
                    .post("/api/v1/bookshelves/10/books") {
                        header(X_BOOKSHELF_TOKEN, "correctToken")
                        contentType = MediaType.APPLICATION_JSON
                        content = objectMapper.writeValueAsString(invalidDto)
                    }.andExpect { status { isBadRequest() } }
                    .andReturn()
                    .response
                    .contentAsString

            val typeRef = object : TypeReference<ApiResponse<BookshelfError>>() {}
            val response: ApiResponse<BookshelfError> = objectMapper.readValue(responseBody, typeRef)

            assertNotNull(response.error, "Response error should not be null")
            val responseError = response.error!!
            assertEquals(
                "Validation failed",
                responseError.message,
                "Response error message should indicate failed validation",
            )
            assertEquals(
                "Title is required",
                responseError.fieldErrors?.values?.first(),
                "Response field errors should indicate missing title field",
            )
            assertEquals(ErrorCodes.VALIDATION_ERROR, responseError.code, "Response error code should indicate validation error")
            assertNull(response.data, "Response data should be null for unsuccessful response")
        }

        @Test
        fun `Post book returns FORBIDDEN when bookshelf edit token does not match`() {
            val bookshelf = Bookshelf(id = 10, publicId = "publicId", name = "Test bookshelf", editTokenHash = "editTokenHash")
            val dto = CreateBookDto(title = "New book", author = "Test author")
            given(bookshelfService.getBookshelfByPublicId(bookshelf.publicId)).willReturn(Either.Right(bookshelf))

            val responseBody =
                mockMvc
                    .post("/api/v1/bookshelves/publicId/books") {
                        contentType = MediaType.APPLICATION_JSON
                        header(X_BOOKSHELF_TOKEN, "notValidToken")
                        content = objectMapper.writeValueAsString(dto)
                    }.andExpect { status { isForbidden() } }
                    .andReturn()
                    .response
                    .contentAsString

            val typeRef = object : TypeReference<ApiResponse<BookshelfError>>() {}
            val response: ApiResponse<BookshelfError> = objectMapper.readValue(responseBody, typeRef)

            assertNotNull(response.error, "Response error should not be null")
            val responseError = response.error!!
            assertEquals(
                "Not allowed to edit this bookshelf",
                responseError.message,
                "Response error message should indicate unfound bookshelf",
            )
            assertEquals(ErrorCodes.FORBIDDEN, responseError.code, "Response error code should indicate forbidden action")
            assertNull(response.data, "Response data should be null for unsuccessful response")
        }
    }

    @Nested
    inner class UpdateBookshelf {
        @Test
        fun `Put bookshelf returns BookshelfDto when successful`() {
            val bookshelf = Bookshelf(id = 10, publicId = "publicId", name = "Old bookshelf", editTokenHash = "editTokenHash")
            val dto = UpdateBookshelfDto(name = "Updated bookshelf", description = "Updated bookshelf")
            val updated =
                Bookshelf(
                    id = bookshelf.id,
                    name = dto.name!!,
                    description = dto.description,
                    publicId = bookshelf.publicId,
                    editTokenHash = bookshelf.editTokenHash,
                )

            given(bookshelfService.getBookshelfByPublicId(bookshelf.publicId)).willReturn(Either.Right(bookshelf))
            given(bookshelfService.verifyToken(bookshelf, "editToken")).willReturn(true)
            given(bookshelfService.saveBookshelf(any())).willReturn(updated)

            val responseBody =
                mockMvc
                    .put("/api/v1/bookshelves/publicId") {
                        contentType = MediaType.APPLICATION_JSON
                        header(X_BOOKSHELF_TOKEN, "editToken")
                        content = objectMapper.writeValueAsString(dto)
                    }.andExpect { status { isOk() } }
                    .andReturn()
                    .response
                    .contentAsString

            val typeRef = object : TypeReference<ApiResponse<BookshelfDto>>() {}
            val response: ApiResponse<BookshelfDto> = objectMapper.readValue(responseBody, typeRef)

            assertNotNull(response.data, "Response data should not be null")
            val responseData = response.data!!
            assertEquals(updated.toBookshelfDto(), responseData, "Response bookshelf should match expected DTO representation")
            assertNull(response.error, "Response error should be null for successful response")
        }

        @Test
        fun `Put bookshelf returns 404 when bookshelf not found`() {
            val dto = UpdateBookshelfDto(name = "Updated bookshelf", description = "Updated bookshelf")
            given(
                bookshelfService.getBookshelfByPublicId("invalidId"),
            ).willReturn(Either.Left(BookshelfError.NotFoundByPublicId("invalidId")))

            val responseBody =
                mockMvc
                    .put("/api/v1/bookshelves/invalidId") {
                        contentType = MediaType.APPLICATION_JSON
                        header(X_BOOKSHELF_TOKEN, "editToken")
                        content = objectMapper.writeValueAsString(dto)
                    }.andExpect { status { isNotFound() } }
                    .andReturn()
                    .response
                    .contentAsString

            val typeRef = object : TypeReference<ApiResponse<BookshelfError>>() {}
            val response: ApiResponse<BookshelfError> = objectMapper.readValue(responseBody, typeRef)

            assertNotNull(response.error, "Response error should not be null")
            val responseError = response.error!!
            assertEquals(
                "Bookshelf with id invalidId not found",
                responseError.message,
                "Response error message should indicate unfound bookshelf",
            )
            assertEquals(ErrorCodes.BOOKSHELF_NOT_FOUND, responseError.code, "Response error code should indicate bookshelf not found")
            assertNull(response.data, "Response data should be null for unsuccessful response")
        }

        @Test
        fun `Put bookshelf returns 400 Bad Request when name is too long`() {
            val bookshelf = Bookshelf(id = 1, publicId = "publicId", name = "Test bookshelf", editTokenHash = "editTokenHash")
            val invalidDto = UpdateBookshelfDto(name = "x".repeat(300), description = null)

            given(bookshelfService.getBookshelfByPublicId(bookshelf.publicId)).willReturn(Either.Right(bookshelf))

            val responseBody =
                mockMvc
                    .put("/api/v1/bookshelves/publicId") {
                        header(X_BOOKSHELF_TOKEN, "editToken")
                        contentType = MediaType.APPLICATION_JSON
                        content = objectMapper.writeValueAsString(invalidDto)
                    }.andExpect { status { isBadRequest() } }
                    .andReturn()
                    .response
                    .contentAsString

            val typeRef = object : TypeReference<ApiResponse<BookshelfError>>() {}
            val response: ApiResponse<BookshelfError> = objectMapper.readValue(responseBody, typeRef)

            assertNotNull(response.error, "Response error should not be null")
            val responseError = response.error!!
            assertEquals(
                "Validation failed",
                responseError.message,
                "Response error message should indicate failed validation",
            )
            assertEquals(
                "Bookshelf name must be at most 100 characters",
                responseError.fieldErrors?.values?.first(),
                "Response field errors should indicate invalid bookshelf name",
            )
            assertEquals(ErrorCodes.VALIDATION_ERROR, responseError.code, "Response error code should indicate validation error")
            assertNull(response.data, "Response data should be null for unsuccessful response")
        }

        @Test
        fun `Put bookshelf returns FORBIDDEN when bookshelf edit token does not match`() {
            val bookshelf = Bookshelf(id = 10, publicId = "publicId", name = "Test bookshelf", editTokenHash = "editTokenHash")
            val dto = UpdateBookshelfDto(name = "Updated bookshelf", description = "Updated desc")
            given(bookshelfService.getBookshelfByPublicId(bookshelf.publicId)).willReturn(Either.Right(bookshelf))

            val responseBody =
                mockMvc
                    .put("/api/v1/bookshelves/publicId") {
                        contentType = MediaType.APPLICATION_JSON
                        header(X_BOOKSHELF_TOKEN, "notValidToken")
                        content = objectMapper.writeValueAsString(dto)
                    }.andExpect { status { isForbidden() } }
                    .andReturn()
                    .response
                    .contentAsString

            val typeRef = object : TypeReference<ApiResponse<BookshelfError>>() {}
            val response: ApiResponse<BookshelfError> = objectMapper.readValue(responseBody, typeRef)

            assertNotNull(response.error, "Response error should not be null")
            val responseError = response.error!!
            assertEquals(
                "Not allowed to edit this bookshelf",
                responseError.message,
                "Response error message should indicate invalid editToken",
            )
            assertEquals(ErrorCodes.FORBIDDEN, responseError.code, "Response error code should indicate forbidden action")
            assertNull(response.data, "Response data should be null for unsuccessful response")
        }
    }

    @Nested
    inner class UpdateBook {
        @Test
        fun `Put book returns BookDto when successful`() {
            val bookshelf = Bookshelf(id = 10, publicId = "publicId", name = "Bookshelf", editTokenHash = "editTokenHash")
            val book = Book(bookshelfId = 10, id = 10, title = "Old title", author = "Old author")
            val dto = UpdateBookDto(title = "Updated title", author = "Updated author")
            val updated = Book(bookshelfId = book.id, title = dto.title!!, author = dto.author!!)

            given(bookshelfService.getBookshelfByPublicId(bookshelf.publicId)).willReturn(Either.Right(bookshelf))
            given(bookshelfService.verifyToken(bookshelf, "editToken")).willReturn(true)
            given(bookService.getBookById(book.id)).willReturn(Either.Right(book))
            given(bookService.updateBook(eq(book.id), any())).willReturn(Either.Right(updated))

            val responseBody =
                mockMvc
                    .put("/api/v1/bookshelves/publicId/books/10") {
                        contentType = MediaType.APPLICATION_JSON
                        header(X_BOOKSHELF_TOKEN, "editToken")
                        content = objectMapper.writeValueAsString(dto)
                    }.andExpect { status { isOk() } }
                    .andReturn()
                    .response
                    .contentAsString

            val typeRef = object : TypeReference<ApiResponse<BookDto>>() {}
            val response: ApiResponse<BookDto> = objectMapper.readValue(responseBody, typeRef)

            assertNotNull(response.data, "Response data should not be null")
            val responseData = response.data!!
            assertEquals(updated.toDto(bookshelf.publicId), responseData, "Response book should match expected DTO representation")
            assertNull(response.error, "Response error should be null for successful response")
        }

        @Test
        fun `Put book returns 404 when bookshelf not found`() {
            val dto = UpdateBookDto(title = "Updated title", author = "Updated author")

            given(
                bookshelfService.getBookshelfByPublicId("invalidId"),
            ).willReturn(Either.Left(BookshelfError.NotFoundByPublicId("invalidId")))

            val responseBody =
                mockMvc
                    .put("/api/v1/bookshelves/invalidId/books/999") {
                        contentType = MediaType.APPLICATION_JSON
                        header(X_BOOKSHELF_TOKEN, "editToken")
                        content = objectMapper.writeValueAsString(dto)
                    }.andExpect { status { isNotFound() } }
                    .andReturn()
                    .response
                    .contentAsString

            val typeRef = object : TypeReference<ApiResponse<BookshelfError>>() {}
            val response: ApiResponse<BookshelfError> = objectMapper.readValue(responseBody, typeRef)

            assertNotNull(response.error, "Response error should not be null")
            val responseError = response.error!!
            assertEquals(
                "Bookshelf with id invalidId not found",
                responseError.message,
                "Response error message should indicate unfound bookshelf",
            )
            assertEquals(ErrorCodes.BOOKSHELF_NOT_FOUND, responseError.code, "Response error code should indicate bookshelf not found")
            assertNull(response.data, "Response data should be null for unsuccessful response")
        }

        @Test
        fun `Put book returns 404 when book in bookshelf not found`() {
            val bookshelf = Bookshelf(id = 10, publicId = "publicId", name = "Bookshelf", editTokenHash = "editTokenHash")
            val dto = UpdateBookDto(title = "Updated title", author = "Updated author")

            given(bookshelfService.getBookshelfByPublicId(bookshelf.publicId)).willReturn(Either.Right(bookshelf))
            given(bookshelfService.verifyToken(bookshelf, "editToken")).willReturn(true)
            given(bookService.getBookById(999L)).willReturn(Either.Left(BookError.NotFound(999)))

            val responseBody =
                mockMvc
                    .put("/api/v1/bookshelves/publicId/books/999") {
                        contentType = MediaType.APPLICATION_JSON
                        header(X_BOOKSHELF_TOKEN, "editToken")
                        content = objectMapper.writeValueAsString(dto)
                    }.andExpect { status { isNotFound() } }
                    .andReturn()
                    .response
                    .contentAsString

            val typeRef = object : TypeReference<ApiResponse<BookshelfError>>() {}
            val response: ApiResponse<BookshelfError> = objectMapper.readValue(responseBody, typeRef)

            assertNotNull(response.error, "Response error should not be null")
            val responseError = response.error!!
            assertEquals(
                "Book with id 999 not found in bookshelf publicId",
                responseError.message,
                "Response error message should indicate unfound book",
            )
            assertEquals(ErrorCodes.BOOK_NOT_FOUND, responseError.code, "Response error code should indicate book not found")
            assertNull(response.data, "Response data should be null for unsuccessful response")
        }

        @Test
        fun `Put book returns 400 Bad Request when author name too long`() {
            val bookshelf = Bookshelf(id = 10, publicId = "publicId", name = "Test bookshelf", editTokenHash = "editTokenHash")
            val invalidDto = UpdateBookDto(title = "Test book", author = "a".repeat(300))

            given(bookshelfService.getBookshelfByPublicId(bookshelf.publicId)).willReturn(Either.Right(bookshelf))
            given(bookshelfService.verifyToken(bookshelf, "editToken")).willReturn(true)

            val responseBody =
                mockMvc
                    .put("/api/v1/bookshelves/publicId/books/5") {
                        header(X_BOOKSHELF_TOKEN, "editToken")
                        contentType = MediaType.APPLICATION_JSON
                        content = objectMapper.writeValueAsString(invalidDto)
                    }.andExpect { status { isBadRequest() } }
                    .andReturn()
                    .response
                    .contentAsString

            val typeRef = object : TypeReference<ApiResponse<BookshelfError>>() {}
            val response: ApiResponse<BookshelfError> = objectMapper.readValue(responseBody, typeRef)

            assertNotNull(response.error, "Response error should not be null")
            val responseError = response.error!!
            assertEquals(
                "Validation failed",
                responseError.message,
                "Response error message should indicate failed validation",
            )
            assertEquals(
                "Author cannot be empty or exceed 255 characters",
                responseError.fieldErrors?.values?.first(),
                "Response field errors should indicate invalid bookshelf name",
            )
            assertEquals(ErrorCodes.VALIDATION_ERROR, responseError.code, "Response error code should indicate validation error")
            assertNull(response.data, "Response data should be null for unsuccessful response")
        }

        @Test
        fun `Put book returns FORBIDDEN when bookshelf edit token does not match`() {
            val bookshelf = Bookshelf(id = 10, publicId = "publicId", name = "Test bookshelf", editTokenHash = "editTokenHash")
            val dto = UpdateBookDto(title = "Updated title", author = "Updated author")
            given(bookshelfService.getBookshelfByPublicId(bookshelf.publicId)).willReturn(Either.Right(bookshelf))

            val responseBody =
                mockMvc
                    .put("/api/v1/bookshelves/publicId/books/10") {
                        contentType = MediaType.APPLICATION_JSON
                        header(X_BOOKSHELF_TOKEN, "notValidToken")
                        content = objectMapper.writeValueAsString(dto)
                    }.andExpect { status { isForbidden() } }
                    .andReturn()
                    .response
                    .contentAsString

            val typeRef = object : TypeReference<ApiResponse<BookshelfError>>() {}
            val response: ApiResponse<BookshelfError> = objectMapper.readValue(responseBody, typeRef)

            assertNotNull(response.error, "Response error should not be null")
            val responseError = response.error!!
            assertEquals(
                "Not allowed to edit this bookshelf",
                responseError.message,
                "Response error message should indicate invalid editToken",
            )
            assertEquals(ErrorCodes.FORBIDDEN, responseError.code, "Response error code should indicate forbidden action")
            assertNull(response.data, "Response data should be null for unsuccessful response")
        }
    }

    @Nested
    inner class DeleteBookshelf {
        @Test
        fun `Delete bookshelf returns DeleteBookshelfResult when successful`() {
            val bookshelf = Bookshelf(id = 10, publicId = "publicId", name = "Test bookshelf", editTokenHash = "editTokenHash")
            val books =
                listOf(
                    Book(bookshelfId = 10, id = 10, title = "Test title 1", author = "Test author 1"),
                    Book(bookshelfId = 10, id = 11, title = "Test title 2", author = "Test author 2"),
                )
            val deleted = DeleteBookshelfResult(bookshelf.publicId, books.size.toLong())
            given(bookshelfService.getBookshelfByPublicId(bookshelf.publicId)).willReturn(Either.Right(bookshelf))
            given(bookshelfService.verifyToken(bookshelf, "editToken")).willReturn(true)
            given(bookshelfService.deleteBookshelf(bookshelf.publicId)).willReturn(Either.Right(deleted.deletedBooksCount))

            val responseBody =
                mockMvc
                    .delete("/api/v1/bookshelves/publicId") {
                        header(X_BOOKSHELF_TOKEN, "editToken")
                    }.andExpect { status { isOk() } }
                    .andReturn()
                    .response
                    .contentAsString

            val typeRef = object : TypeReference<ApiResponse<DeleteBookshelfResult>>() {}
            val response: ApiResponse<DeleteBookshelfResult> = objectMapper.readValue(responseBody, typeRef)

            assertNotNull(response.data, "Response data should not be null")
            val responseData = response.data!!
            assertEquals(deleted, responseData, "Response format should match expected DTO representation")
            assertNull(response.error, "Response error should be null for successful response")
        }

        @Test
        fun `Delete bookshelf returns 404 when bookshelf not found`() {
            given(
                bookshelfService.getBookshelfByPublicId("invalidId"),
            ).willReturn(Either.Left(BookshelfError.NotFoundByPublicId("invalidId")))

            val responseBody =
                mockMvc
                    .delete("/api/v1/bookshelves/invalidId") {
                        header(X_BOOKSHELF_TOKEN, "editToken")
                    }.andExpect { status { isNotFound() } }
                    .andReturn()
                    .response
                    .contentAsString

            val typeRef = object : TypeReference<ApiResponse<ErrorResponse>>() {}
            val response: ApiResponse<ErrorResponse> = objectMapper.readValue(responseBody, typeRef)

            assertNotNull(response.error, "Response error should not be null")
            val responseError = response.error!!
            assertEquals(
                "Bookshelf with id invalidId not found",
                responseError.message,
                "Response error message should indicate unfound bookshelf",
            )
            assertEquals(ErrorCodes.BOOKSHELF_NOT_FOUND, responseError.code, "Response error code should indicate bookshelf not found")
            assertNull(response.data, "Response data should be null for unsuccessful response")
        }

        @Test
        fun `Delete bookshelf returns FORBIDDEN when bookshelf edit token does not match`() {
            val bookshelf = Bookshelf(id = 10, publicId = "publicId", name = "Test bookshelf", editTokenHash = "editTokenHash")

            given(bookshelfService.getBookshelfByPublicId(bookshelf.publicId)).willReturn(Either.Right(bookshelf))
            given(bookshelfService.verifyToken(bookshelf, "editToken")).willReturn(true)

            val responseBody =
                mockMvc
                    .delete("/api/v1/bookshelves/publicId") {
                        header(X_BOOKSHELF_TOKEN, "notValidToken")
                    }.andExpect { status { isForbidden() } }
                    .andReturn()
                    .response
                    .contentAsString

            val typeRef = object : TypeReference<ApiResponse<ErrorResponse>>() {}
            val response: ApiResponse<ErrorResponse> = objectMapper.readValue(responseBody, typeRef)

            assertNotNull(response.error, "Response error should not be null")
            val responseError = response.error!!
            assertEquals(
                "Not allowed to edit this bookshelf",
                responseError.message,
                "Response error message should indicate invalid editToken",
            )
            assertEquals(ErrorCodes.FORBIDDEN, responseError.code, "Response error code should indicate forbidden action")
            assertNull(response.data, "Response data should be null for unsuccessful response")
        }
    }

    @Nested
    inner class DeleteBook {
        @Test
        fun `Delete book returns id of the deleted book when successful`() {
            val bookshelf = Bookshelf(id = 10, publicId = "publicId", name = "Test bookshelf", editTokenHash = "editTokenHash")
            val book = Book(bookshelfId = 10, id = 10, title = "Test title", author = "Test author")
            given(bookshelfService.getBookshelfByPublicId(bookshelf.publicId)).willReturn(Either.Right(bookshelf))
            given(bookshelfService.verifyToken(bookshelf, "editToken")).willReturn(true)
            given(bookService.getBookById(book.id)).willReturn(Either.Right(book))
            given(bookService.deleteBook(book.id)).willReturn(Either.Right(book.id))

            val responseBody =
                mockMvc
                    .delete("/api/v1/bookshelves/publicId/books/10") {
                        header(X_BOOKSHELF_TOKEN, "editToken")
                    }.andExpect { status { isOk() } }
                    .andReturn()
                    .response
                    .contentAsString

            val typeRef = object : TypeReference<ApiResponse<Long>>() {}
            val response: ApiResponse<Long> = objectMapper.readValue(responseBody, typeRef)

            assertNotNull(response.data, "Response data should not be null")
            assertNull(response.error, "Response error should be null for successful response")
        }

        @Test
        fun `Delete book returns 404 when bookshelf not found`() {
            given(
                bookshelfService.getBookshelfByPublicId("invalidId"),
            ).willReturn(Either.Left(BookshelfError.NotFoundByPublicId("invalidId")))

            val responseBody =
                mockMvc
                    .delete("/api/v1/bookshelves/invalidId/books/10") {
                        header(X_BOOKSHELF_TOKEN, "editToken")
                    }.andExpect { status { isNotFound() } }
                    .andReturn()
                    .response
                    .contentAsString

            val typeRef = object : TypeReference<ApiResponse<ErrorResponse>>() {}
            val response: ApiResponse<ErrorResponse> = objectMapper.readValue(responseBody, typeRef)

            assertNotNull(response.error, "Response error should not be null")
            val responseError = response.error!!
            assertEquals(
                "Bookshelf with id invalidId not found",
                responseError.message,
                "Response error message should indicate unfound bookshelf",
            )
            assertEquals(ErrorCodes.BOOKSHELF_NOT_FOUND, responseError.code, "Response error code should indicate bookshelf not found")
            assertNull(response.data, "Response data should be null for unsuccessful response")
        }

        @Test
        fun `Delete book returns 404 when book in bookshelf not found`() {
            val bookshelf = Bookshelf(id = 10, publicId = "publicId", name = "Test bookshelf", editTokenHash = "editTokenHash")
            given(bookshelfService.getBookshelfByPublicId(bookshelf.publicId)).willReturn(Either.Right(bookshelf))
            given(bookshelfService.verifyToken(bookshelf, "editToken")).willReturn(true)
            given(bookService.deleteBook(999L)).willReturn(Either.Left(BookError.NotFound(999)))

            val responseBody =
                mockMvc
                    .delete("/api/v1/bookshelves/publicId/books/999") {
                        header(X_BOOKSHELF_TOKEN, "editToken")
                    }.andExpect { status { isNotFound() } }
                    .andReturn()
                    .response
                    .contentAsString

            val typeRef = object : TypeReference<ApiResponse<ErrorResponse>>() {}
            val response: ApiResponse<ErrorResponse> = objectMapper.readValue(responseBody, typeRef)

            assertNotNull(response.error, "Response error should not be null")
            val responseError = response.error!!
            assertEquals(
                "Book with id 999 not found in bookshelf publicId",
                responseError.message,
                "Response error message should indicate unfound book",
            )
            assertEquals(ErrorCodes.BOOK_NOT_FOUND, responseError.code, "Response error code should indicate book not found")
            assertNull(response.data, "Response data should be null for unsuccessful response")
        }

        @Test
        fun `Delete book returns FORBIDDEN when bookshelf edit token does not match`() {
            val bookshelf = Bookshelf(id = 10, publicId = "publicId", name = "Test bookshelf", editTokenHash = "editTokenHash")
            given(bookshelfService.getBookshelfByPublicId(bookshelf.publicId)).willReturn(Either.Right(bookshelf))

            val responseBody =
                mockMvc
                    .delete("/api/v1/bookshelves/publicId/books/10") {
                        header(X_BOOKSHELF_TOKEN, "notValidToken")
                    }.andExpect { status { isForbidden() } }
                    .andReturn()
                    .response
                    .contentAsString

            val typeRef = object : TypeReference<ApiResponse<ErrorResponse>>() {}
            val response: ApiResponse<ErrorResponse> = objectMapper.readValue(responseBody, typeRef)

            assertNotNull(response.error, "Response error should not be null")
            val responseError = response.error!!
            assertEquals(
                "Not allowed to edit this bookshelf",
                responseError.message,
                "Response error message should indicate invalid editToken",
            )
            assertEquals(ErrorCodes.FORBIDDEN, responseError.code, "Response error code should indicate forbidden action")
            assertNull(response.data, "Response data should be null for unsuccessful response")
        }
    }
}
