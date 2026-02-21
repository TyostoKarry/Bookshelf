package io.github.tyostokarry.bookshelf.integration

import com.fasterxml.jackson.core.type.TypeReference
import com.fasterxml.jackson.databind.ObjectMapper
import io.github.tyostokarry.bookshelf.config.FlywayTestConfig
import io.github.tyostokarry.bookshelf.config.TestcontainersConfig
import io.github.tyostokarry.bookshelf.controller.advice.ApiResponse
import io.github.tyostokarry.bookshelf.controller.dto.BookDto
import io.github.tyostokarry.bookshelf.controller.dto.BookshelfDto
import io.github.tyostokarry.bookshelf.controller.dto.BookshelfWithTokenDto
import io.github.tyostokarry.bookshelf.controller.dto.CreateBookDto
import io.github.tyostokarry.bookshelf.controller.dto.CreateBookshelfDto
import io.github.tyostokarry.bookshelf.controller.dto.DeleteBookshelfResult
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc
import org.springframework.boot.test.context.SpringBootTest
import org.springframework.context.annotation.Import
import org.springframework.http.MediaType
import org.springframework.test.context.ActiveProfiles
import org.springframework.test.web.servlet.MockMvc
import org.springframework.test.web.servlet.delete
import org.springframework.test.web.servlet.get
import org.springframework.test.web.servlet.post
import java.time.temporal.ChronoUnit
import kotlin.test.Test
import kotlin.test.assertEquals
import kotlin.test.assertNotNull
import kotlin.test.assertNull

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@AutoConfigureMockMvc
@ActiveProfiles("test")
@Import(FlywayTestConfig::class, TestcontainersConfig::class)
class BookshelfIntegrationTest(
    @Autowired val mockMvc: MockMvc,
    @Autowired val objectMapper: ObjectMapper,
) {
    private val apiKey = "test-key"

    @Test
    fun `should create and then retrieve a bookshelf`() {
        // Create a new bookshelf
        val createBookshelfPayload = CreateBookshelfDto(name = "New bookshelf", description = "Test bookshelf")

        val createBookshelfResponseBody =
            mockMvc
                .post("/api/v1/bookshelves") {
                    header("X-API-KEY", apiKey)
                    contentType = MediaType.APPLICATION_JSON
                    content = objectMapper.writeValueAsString(createBookshelfPayload)
                }.andExpect { status { isOk() } }
                .andReturn()
                .response
                .contentAsString

        val createBookshelfTypeRef = object : TypeReference<ApiResponse<BookshelfWithTokenDto>>() {}
        val createBookshelfResponse: ApiResponse<BookshelfWithTokenDto> =
            objectMapper.readValue(
                createBookshelfResponseBody,
                createBookshelfTypeRef,
            )

        assertNotNull(createBookshelfResponse.data, "Create response data should not be null")
        val createBookshelfResponseData = createBookshelfResponse.data!!
        assertEquals(
            createBookshelfPayload.name,
            createBookshelfResponseData.name,
            "Create response bookshelf name should match create payload",
        )
        assertEquals(
            createBookshelfPayload.description,
            createBookshelfResponseData.description,
            "Create response bookshelf description should match create payload",
        )
        assertNotNull(createBookshelfResponseData.publicId, "Create response bookshelf publicId should not be null")
        assertNotNull(createBookshelfResponseData.editToken, "Create response bookshelf editToken should not be null")
        assertNull(createBookshelfResponse.error, "Create response error should be null for successful response")

        // Get bookshelf by publicId
        val getBookshelfResponseBody =
            mockMvc
                .get("/api/v1/bookshelves/${createBookshelfResponseData.publicId}") {
                    header("X-API-KEY", apiKey)
                }.andExpect { status { isOk() } }
                .andReturn()
                .response
                .contentAsString

        val getBookshelfTypeRef = object : TypeReference<ApiResponse<BookshelfDto>>() {}
        val getBookshelfResponse: ApiResponse<BookshelfDto> = objectMapper.readValue(getBookshelfResponseBody, getBookshelfTypeRef)

        assertNotNull(getBookshelfResponse.data, "Get response data should not be null")
        val getBookshelfResponseData = getBookshelfResponse.data!!
        assertEquals(
            createBookshelfResponseData.name,
            getBookshelfResponseData.name,
            "Fetched bookshelf name should match created bookshelf",
        )
        assertEquals(
            createBookshelfResponseData.description,
            getBookshelfResponseData.description,
            "Fetched bookshelf description should match created bookshelf",
        )
        assertEquals(
            createBookshelfResponseData.publicId,
            getBookshelfResponseData.publicId,
            "Fetched bookshelf publicId should be the same as the created one",
        )
        assertEquals(
            createBookshelfResponseData.createdAt.truncatedTo(ChronoUnit.MILLIS),
            getBookshelfResponseData.createdAt.truncatedTo(ChronoUnit.MILLIS),
            "CreatedAt timestamp should match up to millisecond precision",
        )
        assertEquals(
            createBookshelfResponseData.updatedAt.truncatedTo(ChronoUnit.MILLIS),
            getBookshelfResponseData.updatedAt.truncatedTo(ChronoUnit.MILLIS),
            "UpdatedAt timestamp should match up to millisecond precision",
        )
        assertNull(getBookshelfResponse.error, "Get response error should be null for successful response")

        // Add 2 books to bookshelf
        val createBookPayloadOne = CreateBookDto(title = "New book 1", author = "Test author 1")
        val createBookPayloadTwo = CreateBookDto(title = "New book 2", author = "Test author 2")

        val createBookOneResponseBody =
            mockMvc
                .post("/api/v1/bookshelves/${getBookshelfResponseData.publicId}/books") {
                    header("X-API-KEY", apiKey)
                    header("X-BOOKSHELF-TOKEN", createBookshelfResponseData.editToken)
                    contentType = MediaType.APPLICATION_JSON
                    content = objectMapper.writeValueAsString(createBookPayloadOne)
                }.andExpect { status { isOk() } }
                .andReturn()
                .response
                .contentAsString

        val createBookTwoResponseBody =
            mockMvc
                .post("/api/v1/bookshelves/${getBookshelfResponseData.publicId}/books") {
                    header("X-API-KEY", apiKey)
                    header("X-BOOKSHELF-TOKEN", createBookshelfResponseData.editToken)
                    contentType = MediaType.APPLICATION_JSON
                    content = objectMapper.writeValueAsString(createBookPayloadTwo)
                }.andExpect { status { isOk() } }
                .andReturn()
                .response
                .contentAsString

        val bookTypeRef = object : TypeReference<ApiResponse<BookDto>>() {}
        val createBookOneResponse: ApiResponse<BookDto> = objectMapper.readValue(createBookOneResponseBody, bookTypeRef)
        val createBookTwoResponse: ApiResponse<BookDto> = objectMapper.readValue(createBookTwoResponseBody, bookTypeRef)

        assertNotNull(createBookOneResponse.data, "First created book response data should not be null")
        assertNotNull(createBookTwoResponse.data, "Second created book response data should not be null")
        val createdBookOne = createBookOneResponse.data!!
        val createdBookTwo = createBookTwoResponse.data!!
        assertEquals(
            createBookPayloadOne.title,
            createdBookOne.title,
            "First created book should have matching title",
        )
        assertEquals(
            createBookPayloadTwo.title,
            createdBookTwo.title,
            "Second created book should have matching title",
        )
        assertNull(createBookOneResponse.error, "Get first book response error should be null for successful response")
        assertNull(createBookTwoResponse.error, "Get second book response error should be null for successful response")

        // Retrieve all books in the bookshelf and verify both are returned
        val getBooksResponseBody =
            mockMvc
                .get("/api/v1/bookshelves/${getBookshelfResponseData.publicId}/books") {
                    header("X-API-KEY", apiKey)
                }.andExpect { status { isOk() } }
                .andReturn()
                .response
                .contentAsString

        val bookListTypeRef = object : TypeReference<ApiResponse<List<BookDto>>>() {}
        val getBooksResponse: ApiResponse<List<BookDto>> = objectMapper.readValue(getBooksResponseBody, bookListTypeRef)

        assertNotNull(getBooksResponse.data, "Get books response data should not be null")
        val getBooksResponseData = getBooksResponse.data!!
        assertEquals(2, getBooksResponseData.size, "There should be exactly 2 books in the bookshelf after creation")
        val titles = getBooksResponseData.map { it.title }.toSet()
        assert(titles.containsAll(listOf("New book 1", "New book 2"))) {
            "Expected both book titles ('New book 1', 'New book 2') to be present in retrieved list"
        }
        assertNull(getBooksResponse.error, "Get books response error should be null for successful response")

        // Delete bookshelf
        val deleteBookshelfResponseBody =
            mockMvc
                .delete("/api/v1/bookshelves/${getBookshelfResponseData.publicId}") {
                    header("X-API-KEY", apiKey)
                    header("X-BOOKSHELF-TOKEN", createBookshelfResponseData.editToken)
                }.andExpect { status { isOk() } }
                .andReturn()
                .response
                .contentAsString

        val deleteTypeRef = object : TypeReference<ApiResponse<DeleteBookshelfResult>>() {}
        val deleteBookshelfResponse: ApiResponse<DeleteBookshelfResult> = objectMapper.readValue(deleteBookshelfResponseBody, deleteTypeRef)

        assertNotNull(deleteBookshelfResponse.data, "Delete bookshelf response data should not be null")
        val deleteBookshelfResponseData = deleteBookshelfResponse.data!!
        assertEquals(
            getBookshelfResponseData.publicId,
            deleteBookshelfResponseData.deletedBookshelfPublicId,
            "Deleted bookshelf public id should be match the original created bookshelf",
        )
        assertEquals(
            getBooksResponseData.size.toLong(),
            deleteBookshelfResponseData.deletedBooksCount,
            "Deleted book count should match the size of ",
        )
        assertNull(deleteBookshelfResponse.error, "Number of deleted books should equal the number of books that existed in the bookshelf")
    }

    @Test
    fun `should reject requests with missing or invalid api key`() {
        mockMvc
            .get("/api/v1/bookshelves")
            .andExpect { status { isUnauthorized() } }
    }
}
