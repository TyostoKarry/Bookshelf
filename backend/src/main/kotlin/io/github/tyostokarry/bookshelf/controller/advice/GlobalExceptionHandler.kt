package io.github.tyostokarry.bookshelf.controller.advice

import com.fasterxml.jackson.databind.exc.MismatchedInputException
import org.springframework.http.ResponseEntity
import org.springframework.http.converter.HttpMessageNotReadableException
import org.springframework.web.bind.MethodArgumentNotValidException
import org.springframework.web.bind.annotation.ExceptionHandler
import org.springframework.web.bind.annotation.RestControllerAdvice

@RestControllerAdvice
class GlobalExceptionHandler {
    @ExceptionHandler(MethodArgumentNotValidException::class)
    fun handleValidationError(exception: MethodArgumentNotValidException): ResponseEntity<ApiResponse<ErrorResponse>> {
        val errors =
            exception.bindingResult.fieldErrors.associate { fieldError ->
                fieldError.field to (fieldError.defaultMessage ?: "Invalid value")
            }

        val errorResponse =
            ErrorResponse(
                message = "Validation failed",
                code = ErrorCodes.VALIDATION_ERROR,
                fieldErrors = errors,
            )

        return ResponseEntity.badRequest().body(ApiResponse(error = errorResponse))
    }

    @ExceptionHandler(HttpMessageNotReadableException::class)
    fun handleJsonParseError(exception: HttpMessageNotReadableException): ResponseEntity<ApiResponse<ErrorResponse>> {
        val cause = exception.cause
        val fieldErrors: Map<String, String>? =
            if (cause is MismatchedInputException) {
                cause.path.mapNotNull { ref -> ref.fieldName }.associateWith { "This field is required or has wrong type" }
            } else {
                null
            }

        val errorResponse =
            ErrorResponse(
                message = "Malformed JSON or missing required fields",
                code = ErrorCodes.VALIDATION_ERROR,
                fieldErrors = fieldErrors,
            )

        return ResponseEntity.badRequest().body(ApiResponse(error = errorResponse))
    }
}
