package io.github.tyostokarry.bookshelf.security

import com.fasterxml.jackson.module.kotlin.jacksonObjectMapper
import io.github.tyostokarry.bookshelf.config.AppProperties
import io.github.tyostokarry.bookshelf.controller.ApiResponse
import io.github.tyostokarry.bookshelf.controller.ErrorCodes
import io.github.tyostokarry.bookshelf.controller.ErrorResponse
import jakarta.servlet.FilterChain
import jakarta.servlet.http.HttpServletRequest
import jakarta.servlet.http.HttpServletResponse
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken
import org.springframework.security.core.context.SecurityContextHolder
import org.springframework.stereotype.Component
import org.springframework.web.filter.OncePerRequestFilter

@Component
class ApiKeyAuthFilter(
    private val appProperties: AppProperties,
) : OncePerRequestFilter() {
    private val mapper = jacksonObjectMapper()

    override fun doFilterInternal(
        request: HttpServletRequest,
        response: HttpServletResponse,
        filterChain: FilterChain,
    ) {
        val requestKey = request.getHeader("X-API-KEY")
        val validKey = appProperties.apiKey

        if (requestKey == null || requestKey != validKey) {
            response.status = HttpServletResponse.SC_UNAUTHORIZED
            response.contentType = "application/json"

            val errorBody =
                ApiResponse<Any>(
                    data = null,
                    error = ErrorResponse(message = "Missing or invalid API key", code = ErrorCodes.INVALID_API_KEY),
                )

            response.writer.write(mapper.writeValueAsString(errorBody))
            return
        }

        val auth = UsernamePasswordAuthenticationToken("apiKeyUser", null, emptyList())
        SecurityContextHolder.getContext().authentication = auth

        filterChain.doFilter(request, response)
    }
}
