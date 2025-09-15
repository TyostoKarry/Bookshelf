package io.github.tyostokarry.bookshelf.controller

import arrow.core.Either
import io.github.tyostokarry.bookshelf.controller.advice.ApiResponse
import io.github.tyostokarry.bookshelf.controller.advice.ErrorCodes
import io.github.tyostokarry.bookshelf.controller.advice.ErrorResponse
import io.github.tyostokarry.bookshelf.controller.dto.BookDto
import io.github.tyostokarry.bookshelf.controller.dto.toDto
import io.github.tyostokarry.bookshelf.service.BookService
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("/books")
class BookController(
    private val bookService: BookService,
) {
    @GetMapping
    fun getAllBooks(): ResponseEntity<ApiResponse<List<BookDto>>> =
        ResponseEntity.ok(ApiResponse(data = bookService.getAllBooks().map { it.toDto() }))

    @GetMapping("/{id}")
    fun getBook(
        @PathVariable id: Long,
    ): ResponseEntity<ApiResponse<BookDto>> =
        when (val result = bookService.getBookById(id)) {
            is Either.Right -> ResponseEntity.ok(ApiResponse(data = result.value.toDto()))
            is Either.Left ->
                ResponseEntity.status(404).body(
                    ApiResponse(
                        error =
                            ErrorResponse(
                                "Book with id $id not found",
                                ErrorCodes.BOOK_NOT_FOUND,
                            ),
                    ),
                )
        }
}
