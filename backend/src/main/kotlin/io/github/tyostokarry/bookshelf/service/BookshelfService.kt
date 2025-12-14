package io.github.tyostokarry.bookshelf.service

import arrow.core.Either
import arrow.core.left
import arrow.core.right
import com.aventrix.jnanoid.jnanoid.NanoIdUtils
import io.github.tyostokarry.bookshelf.entity.Bookshelf
import io.github.tyostokarry.bookshelf.error.BookshelfError
import io.github.tyostokarry.bookshelf.repository.BookshelfRepository
import io.github.tyostokarry.bookshelf.security.TokenHasher
import org.hibernate.validator.constraints.UUID
import org.springframework.data.repository.findByIdOrNull
import org.springframework.stereotype.Service

@Service
class BookshelfService(
    private val bookService: BookService,
    private val bookshelfRepository: BookshelfRepository,
    private val tokenHasher: TokenHasher,
) {
    fun getAllBookshelves(): List<Bookshelf> = bookshelfRepository.findAll()

    fun getBookshelfById(id: Long): Either<BookshelfError, Bookshelf> =
        bookshelfRepository.findByIdOrNull(id)?.right() ?: BookshelfError.NotFoundById(id).left()

    fun getBookshelfByPublicId(publicId: String): Either<BookshelfError, Bookshelf> =
        bookshelfRepository.findByPublicId(publicId)?.right() ?: BookshelfError.NotFoundByPublicId(publicId).left()

    fun getBookshelfByToken(editToken: String): Either<BookshelfError, Bookshelf> {
        val (publicId, _) =
            editToken.split(".", limit = 2).let {
                it.getOrNull(0) to it.getOrNull(1)
            }

        if (publicId == null) {
            return BookshelfError.NotFoundByToken(editToken).left()
        }

        val bookshelf =
            bookshelfRepository.findByPublicId(publicId)
                ?: return BookshelfError.NotFoundByPublicId(publicId).left()

        return if (tokenHasher.match(editToken, bookshelf.editTokenHash)) {
            bookshelf.right()
        } else {
            BookshelfError.NotFoundByToken(editToken).left()
        }
    }

    fun createBookshelf(
        dtoName: String,
        dtoDescription: String?,
    ): Pair<String, Bookshelf> {
        val publicId = NanoIdUtils.randomNanoId()
        val rawEditToken = "$publicId.${java.util.UUID.randomUUID()}"
        val hashedEditToken = tokenHasher.hash(rawEditToken)
        val savedBookshelf =
            bookshelfRepository.save(
                Bookshelf(name = dtoName, description = dtoDescription, publicId = publicId, editTokenHash = hashedEditToken),
            )
        return rawEditToken to savedBookshelf
    }

    fun createBookshelfWithPublicId(
        publicId: String,
        dtoName: String,
        dtoDescription: String?,
    ): Pair<String, Bookshelf> {
        val rawEditToken = "$publicId.${java.util.UUID.randomUUID()}"
        val hashedEditToken = tokenHasher.hash(rawEditToken)
        val savedBookshelf =
            bookshelfRepository.save(
                Bookshelf(name = dtoName, description = dtoDescription, publicId = publicId, editTokenHash = hashedEditToken),
            )
        return rawEditToken to savedBookshelf
    }

    fun verifyToken(
        bookshelf: Bookshelf,
        providedToken: String,
    ): Boolean = tokenHasher.match(providedToken, bookshelf.editTokenHash)

    fun saveBookshelf(bookshelf: Bookshelf): Bookshelf = bookshelfRepository.save(bookshelf)

    fun deleteBookshelf(publicId: String): Either<BookshelfError, Long> {
        val bookshelf =
            bookshelfRepository.findByPublicId(publicId)
                ?: return BookshelfError.NotFoundByPublicId(publicId).left()

        val deleteCount = bookService.deleteBooksInBookshelf(bookshelf.id)
        bookshelfRepository.deleteById(bookshelf.id)
        return deleteCount.right()
    }
}
