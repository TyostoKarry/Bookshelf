package io.github.tyostokarry.bookshelf.controller

import arrow.core.Either
import io.github.tyostokarry.bookshelf.controller.dto.BookshelfDto
import io.github.tyostokarry.bookshelf.controller.dto.BookshelfWithTokenDto
import io.github.tyostokarry.bookshelf.controller.dto.toBookshelfDto
import io.github.tyostokarry.bookshelf.controller.dto.toBookshelfWithTokenDto
import io.github.tyostokarry.bookshelf.entity.Book
import io.github.tyostokarry.bookshelf.entity.Bookshelf
import io.github.tyostokarry.bookshelf.service.BookService
import io.github.tyostokarry.bookshelf.service.BookshelfService
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.DeleteMapping
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.PostMapping
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
                    .status(
                        404,
                    ).body(ApiResponse(error = ErrorResponse("Bookshelf with id $id not found", ErrorCodes.BOOKSHELF_NOT_FOUND)))
        }

    @GetMapping("/{id}/books")
    fun getBooksInBookshelf(
        @PathVariable id: Long,
    ): ResponseEntity<ApiResponse<List<Book>>> =
        when (val bookshelfExists = bookshelfService.getBookshelfById(id)) {
            is Either.Right -> ResponseEntity.ok(ApiResponse(data = bookService.getBooksByBookshelf(bookshelfExists.value.id)))
            is Either.Left ->
                ResponseEntity
                    .status(
                        404,
                    ).body(ApiResponse(error = ErrorResponse("Bookshelf with id $id not found", ErrorCodes.BOOKSHELF_NOT_FOUND)))
        }

    @PostMapping
    fun createBookshelf(
        @RequestBody bookshelf: Bookshelf,
    ): ResponseEntity<ApiResponse<BookshelfWithTokenDto>> {
        val saved = bookshelfService.saveBookshelf(bookshelf)
        return ResponseEntity.ok(ApiResponse(data = saved.toBookshelfWithTokenDto()))
    }

    @PostMapping("/{id}/books")
    fun createBook(
        @PathVariable id: Long,
        @RequestBody book: Book,
        @RequestHeader("X-BOOKSHELF-TOKEN") token: String,
    ): ResponseEntity<ApiResponse<Book>> {
        return when (val bookshelf = bookshelfService.getBookshelfById(id)) {
            is Either.Right -> {
                if (bookshelf.value.editToken != token) {
                    return ResponseEntity
                        .status(
                            403,
                        ).body(ApiResponse(error = ErrorResponse("Not allowed to edit this shelf", ErrorCodes.FORBIDDEN)))
                }

                book.bookshelfId = bookshelf.value.id
                val saved = bookService.saveBook(book)
                ResponseEntity.ok(ApiResponse(data = saved))
            }
            is Either.Left ->
                ResponseEntity
                    .status(
                        404,
                    ).body(ApiResponse(error = ErrorResponse("Bookshelf not found", ErrorCodes.BOOKSHELF_NOT_FOUND)))
        }
    }

    @DeleteMapping("/{id}")
    fun deleteBookshelf(
        @PathVariable id: Long,
    ): ResponseEntity<ApiResponse<Long>> =
        when (val result = bookshelfService.deleteBookshelf(id)) {
            is Either.Right -> ResponseEntity.ok(ApiResponse(data = result.value))
            is Either.Left ->
                ResponseEntity
                    .status(
                        404,
                    ).body(ApiResponse(error = ErrorResponse("Bookshelf with id $id not found", ErrorCodes.BOOKSHELF_NOT_FOUND)))
        }
}
