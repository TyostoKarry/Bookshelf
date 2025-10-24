package io.github.tyostokarry.bookshelf.security

import com.fasterxml.jackson.core.type.TypeReference
import com.fasterxml.jackson.module.kotlin.jacksonObjectMapper
import io.github.tyostokarry.bookshelf.config.AppProperties
import io.github.tyostokarry.bookshelf.controller.advice.ApiResponse
import io.github.tyostokarry.bookshelf.controller.advice.ErrorCodes
import io.github.tyostokarry.bookshelf.service.error.BookshelfError
import jakarta.servlet.FilterChain
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.Test
import org.mockito.kotlin.mock
import org.springframework.mock.web.MockHttpServletRequest
import org.springframework.mock.web.MockHttpServletResponse
import kotlin.test.assertEquals
import kotlin.test.assertNotNull
import kotlin.test.assertNull

class ApiKeyAuthFilterTest {
    private val appProperties = AppProperties(apiKey = "test-key", frontendUrl = "http://localhost:3000")
    private lateinit var filter: ApiKeyAuthFilter
    private val objectMapper = jacksonObjectMapper()

    @BeforeEach
    fun setup() {
        filter = ApiKeyAuthFilter(appProperties)
    }

    @Test
    fun `should allow request when API key is valid`() {
        val req =
            MockHttpServletRequest().apply {
                addHeader("X-API-KEY", "test-key")
            }
        val res = MockHttpServletResponse()
        val chain = mock<FilterChain>()

        filter.doFilter(req, res, chain)

        assertEquals(200, res.status, "Status should remain OK when valid API key provided")
    }

    @Test
    fun `should block request with 401 when API key is missing`() {
        val req = MockHttpServletRequest()
        val res = MockHttpServletResponse()
        val chain = mock<FilterChain>()

        filter.doFilter(req, res, chain)

        val responseBody = res.contentAsString
        val typeRef = object : TypeReference<ApiResponse<BookshelfError>>() {}
        val response: ApiResponse<BookshelfError> = objectMapper.readValue(responseBody, typeRef)

        assertEquals(401, res.status, "Should return HTTP 401 when API key is missing")
        assertNotNull(response.error, "Response error should not be null")
        val responseError = response.error!!
        assertEquals(
            "Missing or invalid API key",
            responseError.message,
            "Response error message should indicate missing or invalid api key",
        )
        assertEquals(ErrorCodes.INVALID_API_KEY, responseError.code, "Response error code should indicate missing or invalid api key")
        assertNull(response.data, "Response data should be null for unsuccessful response")
    }

    @Test
    fun `should block request with 401 when API key is invalid`() {
        val req =
            MockHttpServletRequest().apply {
                addHeader("X-API-KEY", "wrong-key")
            }
        val res = MockHttpServletResponse()
        val chain = mock<FilterChain>()

        filter.doFilter(req, res, chain)

        val responseBody = res.contentAsString
        val typeRef = object : TypeReference<ApiResponse<BookshelfError>>() {}
        val response: ApiResponse<BookshelfError> = objectMapper.readValue(responseBody, typeRef)

        assertEquals(401, res.status, "Should return HTTP 401 when API key is invalid")
        assertNotNull(response.error, "Response error should not be null")
        val responseError = response.error!!
        assertEquals(
            "Missing or invalid API key",
            responseError.message,
            "Response error message should indicate missing or invalid api key",
        )
        assertEquals(ErrorCodes.INVALID_API_KEY, responseError.code, "Response error code should indicate missing or invalid api key")
        assertNull(response.data, "Response data should be null for unsuccessful response")
    }
}
