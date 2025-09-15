package io.github.tyostokarry.bookshelf.controller

import arrow.core.Either
import io.github.tyostokarry.bookshelf.controller.dto.BookDto
import io.github.tyostokarry.bookshelf.controller.dto.BookshelfDto
import io.github.tyostokarry.bookshelf.controller.dto.BookshelfWithTokenDto
import io.github.tyostokarry.bookshelf.controller.dto.CreateBookDto
import io.github.tyostokarry.bookshelf.controller.dto.CreateBookshelfDto
import io.github.tyostokarry.bookshelf.controller.dto.UpdateBookDto
import io.github.tyostokarry.bookshelf.controller.dto.UpdateBookshelfDto
import io.github.tyostokarry.bookshelf.controller.dto.applyTo
import io.github.tyostokarry.bookshelf.controller.dto.toBookshelfDto
import io.github.tyostokarry.bookshelf.controller.dto.toBookshelfWithTokenDto
import io.github.tyostokarry.bookshelf.controller.dto.toDto
import io.github.tyostokarry.bookshelf.controller.dto.toEntity
import io.github.tyostokarry.bookshelf.service.BookService
import io.github.tyostokarry.bookshelf.service.BookshelfService
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

@RestController
@RequestMapping("/bookshelves")
class BookshelfController(
    private val bookService: BookService,
    private val bookshelfService: BookshelfService,
) {
    @GetMapping
    fun getAllBookshelves(): List<BookshelfDto> = bookshelfService.getAllBookshelves().map { it.toBookshelfDto() }

    @GetMapping("/{id}")
    fun getBookshelf(
        @PathVariable id: Long,
    ): ResponseEntity<ApiResponse<BookshelfDto>> =
        when (val result = bookshelfService.getBookshelfById(id)) {
            is Either.Right -> ResponseEntity.ok(ApiResponse(data = result.value.toBookshelfDto()))
            is Either.Left ->
                ResponseEntity
                    .status(404)
                    .body(ApiResponse(error = ErrorResponse("Bookshelf with id $id not found", ErrorCodes.BOOKSHELF_NOT_FOUND)))
        }

    @GetMapping("/{id}/books")
    fun getBooksInBookshelf(
        @PathVariable id: Long,
    ): ResponseEntity<ApiResponse<List<BookDto>>> =
        when (val bookshelfExists = bookshelfService.getBookshelfById(id)) {
            is Either.Right -> {
                val books = bookService.getBooksByBookshelf(bookshelfExists.value.id)
                ResponseEntity.ok(ApiResponse(data = books.map { it.toDto() }))
            }
            is Either.Left ->
                ResponseEntity
                    .status(404)
                    .body(ApiResponse(error = ErrorResponse("Bookshelf with id $id not found", ErrorCodes.BOOKSHELF_NOT_FOUND)))
        }

    @PostMapping
    fun createBookshelf(
        @RequestBody dto: CreateBookshelfDto,
    ): ResponseEntity<ApiResponse<BookshelfWithTokenDto>> {
        val newBookshelf = bookshelfService.saveBookshelf(dto.toEntity())
        return ResponseEntity.ok(ApiResponse(data = newBookshelf.toBookshelfWithTokenDto()))
    }

    @PostMapping("/{id}/books")
    fun createBook(
        @PathVariable id: Long,
        @RequestBody dto: CreateBookDto,
        @RequestHeader("X-BOOKSHELF-TOKEN", required = false) token: String?,
    ): ResponseEntity<ApiResponse<BookDto>> {
        return when (val bookshelf = bookshelfService.getBookshelfById(id)) {
            is Either.Right -> {
                if (token == null || bookshelf.value.editToken != token) {
                    return ResponseEntity
                        .status(403)
                        .body(ApiResponse(error = ErrorResponse("Not allowed to edit this shelf", ErrorCodes.FORBIDDEN)))
                }

                val newBook = bookService.saveBook(dto.toEntity(bookshelf.value.id))
                ResponseEntity.ok(ApiResponse(data = newBook.toDto()))
            }
            is Either.Left ->
                ResponseEntity
                    .status(404)
                    .body(ApiResponse(error = ErrorResponse("Bookshelf with id $id not found", ErrorCodes.BOOKSHELF_NOT_FOUND)))
        }
    }

    @PutMapping("/{id}")
    fun updateBookshelf(
        @PathVariable id: Long,
        @RequestBody dto: UpdateBookshelfDto,
        @RequestHeader("X-BOOKSHELF-TOKEN", required = false) token: String?,
    ): ResponseEntity<ApiResponse<BookshelfDto>> {
        return when (val existingBookshelf = bookshelfService.getBookshelfById(id)) {
            is Either.Right -> {
                if (token == null || existingBookshelf.value.editToken != token) {
                    return ResponseEntity
                        .status(403)
                        .body(ApiResponse(error = ErrorResponse("Not allowed to edit this shelf", ErrorCodes.FORBIDDEN)))
                }

                val updatedBookshelf = bookshelfService.saveBookshelf(dto.applyTo(existingBookshelf.value))
                ResponseEntity.ok(ApiResponse(data = updatedBookshelf.toBookshelfDto()))
            }
            is Either.Left ->
                ResponseEntity
                    .status(
                        404,
                    ).body(ApiResponse(error = ErrorResponse("Bookshelf with id $id not found", ErrorCodes.BOOKSHELF_NOT_FOUND)))
        }
    }

    @PutMapping("/{id}/books/{bookId}")
    fun updateBook(
        @PathVariable id: Long,
        @PathVariable bookId: Long,
        @RequestBody dto: UpdateBookDto,
        @RequestHeader("X-BOOKSHELF-TOKEN", required = false) token: String?,
    ): ResponseEntity<ApiResponse<BookDto>> {
        return when (val bookshelf = bookshelfService.getBookshelfById(id)) {
            is Either.Right -> {
                if (token == null || bookshelf.value.editToken != token) {
                    return ResponseEntity
                        .status(403)
                        .body(ApiResponse(error = ErrorResponse("Not allowed to edit this shelf", ErrorCodes.FORBIDDEN)))
                }

                val existingBook = bookService.getBookById(bookId)
                if (existingBook is Either.Right && existingBook.value.bookshelfId == bookshelf.value.id) {
                    val updatedBook = bookService.saveBook(dto.applyTo(existingBook.value))
                    ResponseEntity.ok(ApiResponse(data = updatedBook.toDto()))
                } else {
                    ResponseEntity
                        .status(404)
                        .body(ApiResponse(error = ErrorResponse("Book not found in this shelf", ErrorCodes.BOOK_NOT_FOUND)))
                }
            }
            is Either.Left ->
                ResponseEntity
                    .status(404)
                    .body(ApiResponse(error = ErrorResponse("Bookshelf with id $id not found", ErrorCodes.BOOKSHELF_NOT_FOUND)))
        }
    }

    @DeleteMapping("/{id}")
    fun deleteBookshelf(
        @PathVariable id: Long,
        @RequestHeader("X-BOOKSHELF-TOKEN", required = false) token: String?,
    ): ResponseEntity<ApiResponse<Long>> {
        return when (val bookshelf = bookshelfService.getBookshelfById(id)) {
            is Either.Right -> {
                if (token == null || bookshelf.value.editToken != token) {
                    return ResponseEntity
                        .status(403)
                        .body(ApiResponse(error = ErrorResponse("Not allowed to edit this shelf", ErrorCodes.FORBIDDEN)))
                }

                ResponseEntity.ok(ApiResponse(data = bookshelfService.deleteBookshelf(bookshelf.value.id).getOrNull()!!))
            }
            is Either.Left ->
                ResponseEntity
                    .status(404)
                    .body(ApiResponse(error = ErrorResponse("Bookshelf with id $id not found", ErrorCodes.BOOKSHELF_NOT_FOUND)))
        }
    }

    @DeleteMapping("/{id}/books/{bookId}")
    fun deleteBook(
        @PathVariable id: Long,
        @PathVariable bookId: Long,
        @RequestHeader("X-BOOKSHELF-TOKEN", required = false) token: String?,
    ): ResponseEntity<ApiResponse<Unit>> {
        return when (val bookshelf = bookshelfService.getBookshelfById(id)) {
            is Either.Right -> {
                if (token == null || bookshelf.value.editToken != token) {
                    return ResponseEntity
                        .status(
                            403,
                        ).body(ApiResponse(error = ErrorResponse("Not allowed to edit this shelf", ErrorCodes.FORBIDDEN)))
                }

                val existingBook = bookService.getBookById(bookId)
                if (existingBook is Either.Right && existingBook.value.bookshelfId == bookshelf.value.id) {
                    bookService.deleteBook(bookId)
                    ResponseEntity.ok(ApiResponse(data = Unit))
                } else {
                    ResponseEntity
                        .status(404)
                        .body(ApiResponse(error = ErrorResponse("Book not found in this shelf", ErrorCodes.BOOK_NOT_FOUND)))
                }
            }
            is Either.Left ->
                ResponseEntity
                    .status(404)
                    .body(ApiResponse(error = ErrorResponse("Bookshelf with id $id not found", ErrorCodes.BOOKSHELF_NOT_FOUND)))
        }
    }
}
