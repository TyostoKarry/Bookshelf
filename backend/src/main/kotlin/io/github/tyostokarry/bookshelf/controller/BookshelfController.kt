package io.github.tyostokarry.bookshelf.controller

import arrow.core.Either
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
import io.github.tyostokarry.bookshelf.controller.dto.applyTo
import io.github.tyostokarry.bookshelf.controller.dto.toBookshelfDto
import io.github.tyostokarry.bookshelf.controller.dto.toBookshelfWithTokenDto
import io.github.tyostokarry.bookshelf.controller.dto.toDto
import io.github.tyostokarry.bookshelf.controller.dto.toEntity
import io.github.tyostokarry.bookshelf.service.BookService
import io.github.tyostokarry.bookshelf.service.BookshelfService
import jakarta.validation.Valid
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.DeleteMapping
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.PutMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestHeader
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

const val X_BOOKSHELF_TOKEN = "X-BOOKSHELF-TOKEN"

@RestController
@RequestMapping("/api/v1/bookshelves")
class BookshelfController(
    private val bookService: BookService,
    private val bookshelfService: BookshelfService,
) {
    @GetMapping
    fun getAllBookshelves(): ResponseEntity<ApiResponse<List<BookshelfDto>>> =
        ResponseEntity.ok(ApiResponse(data = bookshelfService.getAllBookshelves().map { it.toBookshelfDto() }))

    @GetMapping("/{publicId}")
    fun getBookshelf(
        @PathVariable publicId: String,
    ): ResponseEntity<ApiResponse<BookshelfDto>> =
        when (val result = bookshelfService.getBookshelfByPublicId(publicId)) {
            is Either.Right -> ResponseEntity.ok(ApiResponse(data = result.value.toBookshelfDto()))
            is Either.Left ->
                ResponseEntity
                    .status(404)
                    .body(ApiResponse(error = ErrorResponse("Bookshelf with id $publicId not found", ErrorCodes.BOOKSHELF_NOT_FOUND)))
        }

    @GetMapping("/token/{token}")
    fun getBookshelfByToken(
        @PathVariable token: String,
    ): ResponseEntity<ApiResponse<BookshelfDto>> =
        when (val result = bookshelfService.getBookshelfByToken(token)) {
            is Either.Right -> ResponseEntity.ok(ApiResponse(data = result.value.toBookshelfDto()))
            is Either.Left ->
                ResponseEntity
                    .status(
                        404,
                    ).body(ApiResponse(error = ErrorResponse("Bookshelf with token $token not found", ErrorCodes.BOOKSHELF_NOT_FOUND)))
        }

    @GetMapping("/{publicId}/books")
    fun getBooksInBookshelf(
        @PathVariable publicId: String,
    ): ResponseEntity<ApiResponse<List<BookDto>>> =
        when (val bookshelfExists = bookshelfService.getBookshelfByPublicId(publicId)) {
            is Either.Right -> {
                val books = bookService.getBooksByBookshelf(bookshelfExists.value.id)
                ResponseEntity.ok(ApiResponse(data = books.map { it.toDto(bookshelfExists.value.publicId) }))
            }
            is Either.Left ->
                ResponseEntity
                    .status(404)
                    .body(
                        ApiResponse(
                            error =
                                ErrorResponse(
                                    "Bookshelf with id $publicId not found",
                                    ErrorCodes.BOOKSHELF_NOT_FOUND,
                                ),
                        ),
                    )
        }

    @GetMapping("/token/{token}/books")
    fun getBooksInBookshelfByToken(
        @PathVariable token: String,
    ): ResponseEntity<ApiResponse<List<BookDto>>> =
        when (val bookshelfExists = bookshelfService.getBookshelfByToken(token)) {
            is Either.Right -> {
                val books = bookService.getBooksByBookshelf(bookshelfExists.value.id)
                ResponseEntity.ok(ApiResponse(data = books.map { it.toDto(bookshelfExists.value.publicId) }))
            }
            is Either.Left ->
                ResponseEntity
                    .status(404)
                    .body(
                        ApiResponse(
                            error =
                                ErrorResponse(
                                    "Bookshelf with token $token not found",
                                    ErrorCodes.BOOKSHELF_NOT_FOUND,
                                ),
                        ),
                    )
        }

    @PostMapping
    fun createBookshelf(
        @Valid @RequestBody dto: CreateBookshelfDto,
    ): ResponseEntity<ApiResponse<BookshelfWithTokenDto>> {
        val (rawEditToken, bookshelf) = bookshelfService.createBookshelf(dto.name, dto.description)
        val createBookshelfResponse = bookshelf.toBookshelfWithTokenDto(rawEditToken)
        return ResponseEntity.ok(ApiResponse(data = createBookshelfResponse))
    }

    @PostMapping("/{publicId}/books")
    fun createBook(
        @PathVariable publicId: String,
        @Valid @RequestBody dto: CreateBookDto,
        @RequestHeader(X_BOOKSHELF_TOKEN, required = false) token: String?,
    ): ResponseEntity<ApiResponse<BookDto>> {
        return when (val bookshelf = bookshelfService.getBookshelfByPublicId(publicId)) {
            is Either.Right -> {
                if (token == null || !bookshelfService.verifyToken(bookshelf.value, token)) {
                    return ResponseEntity
                        .status(403)
                        .body(
                            ApiResponse(
                                error =
                                    ErrorResponse(
                                        "Not allowed to edit this bookshelf",
                                        ErrorCodes.FORBIDDEN,
                                    ),
                            ),
                        )
                }

                val newBook = bookService.saveBook(dto.toEntity(bookshelf.value.id))
                ResponseEntity.ok(ApiResponse(data = newBook.toDto(bookshelf.value.publicId)))
            }
            is Either.Left ->
                ResponseEntity
                    .status(404)
                    .body(
                        ApiResponse(
                            error =
                                ErrorResponse(
                                    "Bookshelf with id $publicId not found",
                                    ErrorCodes.BOOKSHELF_NOT_FOUND,
                                ),
                        ),
                    )
        }
    }

    @PutMapping("/{publicId}")
    fun updateBookshelf(
        @PathVariable publicId: String,
        @Valid @RequestBody dto: UpdateBookshelfDto,
        @RequestHeader(X_BOOKSHELF_TOKEN, required = false) token: String?,
    ): ResponseEntity<ApiResponse<BookshelfDto>> {
        return when (val existingBookshelf = bookshelfService.getBookshelfByPublicId(publicId)) {
            is Either.Right -> {
                if (token == null || !bookshelfService.verifyToken(existingBookshelf.value, token)) {
                    return ResponseEntity
                        .status(403)
                        .body(
                            ApiResponse(
                                error =
                                    ErrorResponse(
                                        "Not allowed to edit this bookshelf",
                                        ErrorCodes.FORBIDDEN,
                                    ),
                            ),
                        )
                }

                val updatedBookshelf = bookshelfService.saveBookshelf(dto.applyTo(existingBookshelf.value))
                ResponseEntity.ok(ApiResponse(data = updatedBookshelf.toBookshelfDto()))
            }
            is Either.Left ->
                ResponseEntity
                    .status(
                        404,
                    ).body(
                        ApiResponse(
                            error =
                                ErrorResponse(
                                    "Bookshelf with id $publicId not found",
                                    ErrorCodes.BOOKSHELF_NOT_FOUND,
                                ),
                        ),
                    )
        }
    }

    @PutMapping("/{publicId}/books/{bookId}")
    fun updateBook(
        @PathVariable publicId: String,
        @PathVariable bookId: Long,
        @Valid @RequestBody dto: UpdateBookDto,
        @RequestHeader(X_BOOKSHELF_TOKEN, required = false) token: String?,
    ): ResponseEntity<ApiResponse<BookDto>> {
        return when (val bookshelf = bookshelfService.getBookshelfByPublicId(publicId)) {
            is Either.Right -> {
                if (token == null || !bookshelfService.verifyToken(bookshelf.value, token)) {
                    return ResponseEntity
                        .status(403)
                        .body(
                            ApiResponse(
                                error =
                                    ErrorResponse(
                                        "Not allowed to edit this bookshelf",
                                        ErrorCodes.FORBIDDEN,
                                    ),
                            ),
                        )
                }

                val existingBook = bookService.getBookById(bookId)
                if (existingBook is Either.Right && existingBook.value.bookshelfId == bookshelf.value.id) {
                    val updatedEntity = dto.applyTo(existingBook.value)
                    when (val result = bookService.updateBook(bookId, updatedEntity)) {
                        is Either.Right ->
                            ResponseEntity.ok(ApiResponse(data = result.value.toDto(bookshelf.value.publicId)))

                        is Either.Left ->
                            ResponseEntity.status(404).body(
                                ApiResponse(
                                    error =
                                        ErrorResponse(
                                            "Book with id $bookId not found in bookshelf $publicId",
                                            ErrorCodes.BOOK_NOT_FOUND,
                                        ),
                                ),
                            )
                    }
                } else {
                    ResponseEntity
                        .status(404)
                        .body(
                            ApiResponse(
                                error =
                                    ErrorResponse(
                                        "Book with id $bookId not found in bookshelf $publicId",
                                        ErrorCodes.BOOK_NOT_FOUND,
                                    ),
                            ),
                        )
                }
            }
            is Either.Left ->
                ResponseEntity
                    .status(404)
                    .body(
                        ApiResponse(
                            error =
                                ErrorResponse(
                                    "Bookshelf with id $publicId not found",
                                    ErrorCodes.BOOKSHELF_NOT_FOUND,
                                ),
                        ),
                    )
        }
    }

    @DeleteMapping("/{publicId}")
    fun deleteBookshelf(
        @PathVariable publicId: String,
        @RequestHeader(X_BOOKSHELF_TOKEN, required = false) token: String?,
    ): ResponseEntity<ApiResponse<DeleteBookshelfResult>> {
        return when (val bookshelf = bookshelfService.getBookshelfByPublicId(publicId)) {
            is Either.Right -> {
                if (token == null || !bookshelfService.verifyToken(bookshelf.value, token)) {
                    return ResponseEntity
                        .status(403)
                        .body(
                            ApiResponse(
                                error =
                                    ErrorResponse(
                                        "Not allowed to edit this bookshelf",
                                        ErrorCodes.FORBIDDEN,
                                    ),
                            ),
                        )
                }

                val deletedBookCount = bookshelfService.deleteBookshelf(bookshelf.value.publicId).getOrNull()!!
                val payload =
                    DeleteBookshelfResult(
                        deletedBookshelfPublicId = bookshelf.value.publicId,
                        deletedBooksCount = deletedBookCount,
                    )
                ResponseEntity.ok(ApiResponse(data = payload))
            }
            is Either.Left ->
                ResponseEntity
                    .status(404)
                    .body(
                        ApiResponse(
                            error =
                                ErrorResponse(
                                    "Bookshelf with id $publicId not found",
                                    ErrorCodes.BOOKSHELF_NOT_FOUND,
                                ),
                        ),
                    )
        }
    }

    @DeleteMapping("/{publicId}/books/{bookId}")
    fun deleteBook(
        @PathVariable publicId: String,
        @PathVariable bookId: Long,
        @RequestHeader("X-BOOKSHELF-TOKEN", required = false) token: String?,
    ): ResponseEntity<ApiResponse<Long>> {
        return when (val bookshelf = bookshelfService.getBookshelfByPublicId(publicId)) {
            is Either.Right -> {
                if (token == null || !bookshelfService.verifyToken(bookshelf.value, token)) {
                    return ResponseEntity
                        .status(
                            403,
                        ).body(
                            ApiResponse(
                                error =
                                    ErrorResponse(
                                        "Not allowed to edit this bookshelf",
                                        ErrorCodes.FORBIDDEN,
                                    ),
                            ),
                        )
                }

                when (val response = bookService.deleteBook(bookId)) {
                    is Either.Right -> ResponseEntity.ok(ApiResponse(data = response.value))
                    is Either.Left ->
                        ResponseEntity
                            .status(404)
                            .body(
                                ApiResponse(
                                    error =
                                        ErrorResponse(
                                            "Book with id $bookId not found in bookshelf $publicId",
                                            ErrorCodes.BOOK_NOT_FOUND,
                                        ),
                                ),
                            )
                }
            }
            is Either.Left ->
                ResponseEntity
                    .status(404)
                    .body(
                        ApiResponse(
                            error =
                                ErrorResponse(
                                    "Bookshelf with id $publicId not found",
                                    ErrorCodes.BOOKSHELF_NOT_FOUND,
                                ),
                        ),
                    )
        }
    }
}
