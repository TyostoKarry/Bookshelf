package io.github.tyostokarry.bookshelf.controller

import arrow.core.Either
import io.github.tyostokarry.bookshelf.controller.advice.ApiResponse
import io.github.tyostokarry.bookshelf.controller.advice.ErrorCodes
import io.github.tyostokarry.bookshelf.controller.advice.ErrorResponse
import io.github.tyostokarry.bookshelf.controller.dto.BookDto
import io.github.tyostokarry.bookshelf.controller.dto.toDto
import io.github.tyostokarry.bookshelf.service.BookService
import io.github.tyostokarry.bookshelf.service.BookshelfService
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("/api/v1/books")
class BookController(
    private val bookService: BookService,
    private val bookshelfService: BookshelfService,
) {
    @GetMapping
    fun getAllBooks(): ResponseEntity<ApiResponse<List<BookDto>>> {
        val dtoList =
            bookService.getAllBooks().mapNotNull { book ->
                when (val bookshelfEither = bookshelfService.getBookshelfById(book.bookshelfId)) {
                    is Either.Right -> book.toDto(bookshelfEither.value.publicId)
                    is Either.Left -> null
                }
            }
        return ResponseEntity.ok(ApiResponse(data = dtoList))
    }

    @GetMapping("/{id}")
    fun getBook(
        @PathVariable id: Long,
    ): ResponseEntity<ApiResponse<BookDto>> =
        when (val bookEither = bookService.getBookById(id)) {
            is Either.Right -> {
                val book = bookEither.value
                when (val bookshelfEither = bookshelfService.getBookshelfById(book.bookshelfId)) {
                    is Either.Right ->
                        ResponseEntity.ok(
                            ApiResponse(data = book.toDto(bookshelfEither.value.publicId)),
                        )
                    is Either.Left ->
                        ResponseEntity.status(404).body(
                            ApiResponse(
                                error =
                                    ErrorResponse(
                                        "Bookshelf for book id $id not found",
                                        ErrorCodes.BOOKSHELF_NOT_FOUND,
                                    ),
                            ),
                        )
                }
            }
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
