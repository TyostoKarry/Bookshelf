package io.github.tyostokarry.bookshelf.controller.advice

data class ApiResponse<T>(
    val data: T? = null,
    val error: ErrorResponse? = null,
)

data class ErrorResponse(
    val message: String,
    val code: ErrorCodes,
    val fieldErrors: Map<String, String>? = null,
)
