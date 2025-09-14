package io.github.tyostokarry.bookshelf.controller

import arrow.core.Either
import io.github.tyostokarry.bookshelf.entity.Book
import io.github.tyostokarry.bookshelf.service.BookService
import io.github.tyostokarry.bookshelf.service.BookshelfService
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.DeleteMapping
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.PutMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("/books")
class BookController(
    private val bookService: BookService,
    private val bookshelfService: BookshelfService,
) {
    @GetMapping
    fun getAllBooks(): List<Book> = bookService.getAllBooks()

    @GetMapping("/{id}")
    fun getBook(
        @PathVariable id: Long,
    ): ResponseEntity<ApiResponse<Book>> =
        when (val result = bookService.getBookById(id)) {
            is Either.Right -> ResponseEntity.ok(ApiResponse(data = result.value))
            is Either.Left ->
                ResponseEntity.status(404).body(ApiResponse(error = ErrorResponse("Book with id $id not found", ErrorCodes.BOOK_NOT_FOUND)))
        }

    @PutMapping("/{id}")
    fun updateBook(
        @PathVariable id: Long,
        @RequestBody book: Book,
    ): ResponseEntity<ApiResponse<Book>> =
        when (val result = bookService.updateBook(id, book)) {
            is Either.Right -> ResponseEntity.ok(ApiResponse(data = result.value))
            is Either.Left ->
                ResponseEntity.status(404).body(ApiResponse(error = ErrorResponse("Book with id $id not found", ErrorCodes.BOOK_NOT_FOUND)))
        }

    @DeleteMapping("/{id}")
    fun deleteBook(
        @PathVariable id: Long,
    ): ResponseEntity<Void> =
        when (bookService.deleteBook(id)) {
            is Either.Right -> ResponseEntity.noContent().build()
            is Either.Left -> ResponseEntity.notFound().build()
        }
}
