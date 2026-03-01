package io.github.tyostokarry.bookshelf.service

import arrow.core.Either
import arrow.core.left
import arrow.core.right
import com.aventrix.jnanoid.jnanoid.NanoIdUtils
import io.github.oshai.kotlinlogging.KotlinLogging
import io.github.tyostokarry.bookshelf.entity.Bookshelf
import io.github.tyostokarry.bookshelf.error.BookshelfError
import io.github.tyostokarry.bookshelf.repository.BookshelfRepository
import io.github.tyostokarry.bookshelf.security.TokenHasher
import io.github.tyostokarry.bookshelf.util.logContext
import io.github.tyostokarry.bookshelf.util.masked
import org.springframework.data.repository.findByIdOrNull
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional

@Service
class BookshelfService(
    private val bookService: BookService,
    private val bookshelfRepository: BookshelfRepository,
    private val tokenHasher: TokenHasher,
) {
    private val logger = KotlinLogging.logger {}

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
            logger.warn { "${logContext("getBookshelfByToken")} Token parsing failed: token=${editToken.masked()}" }
            return BookshelfError.NotFoundByToken(editToken).left()
        }

        val bookshelf =
            bookshelfRepository.findByPublicId(publicId)
                ?: run {
                    logger.warn {
                        "${logContext(
                            "getBookshelfByToken",
                        )} Bookshelf not found: publicId=$publicId, token=${editToken.masked()}"
                    }
                    return BookshelfError.NotFoundByPublicId(publicId).left()
                }

        return if (tokenHasher.match(editToken, bookshelf.editTokenHash)) {
            logger.debug { "${logContext("getBookshelfByToken")} Token verified: publicId=$publicId, token=${editToken.masked()}" }
            bookshelf.right()
        } else {
            logger.warn { "${logContext("getBookshelfByToken")} Token mismatch: publicId=$publicId, token=${editToken.masked()}" }
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
        logger.info { "${logContext("createBookshelf")} Created bookshelf: publicId=${savedBookshelf.publicId}, name=$dtoName" }
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
        logger.info { "${logContext("createBookshelfWithPublicId")} Created bookshelf: publicId=$publicId, name=$dtoName" }
        return rawEditToken to savedBookshelf
    }

    fun verifyToken(
        bookshelf: Bookshelf,
        providedToken: String,
    ): Boolean = tokenHasher.match(providedToken, bookshelf.editTokenHash)

    fun saveBookshelf(bookshelf: Bookshelf): Bookshelf {
        val savedBookshelf = bookshelfRepository.save(bookshelf)
        logger.info { "${logContext("saveBookshelf")} Updated bookshelf: publicId=${savedBookshelf.publicId}" }
        return savedBookshelf
    }

    @Transactional
    fun deleteBookshelf(publicId: String): Either<BookshelfError, Long> {
        val bookshelf =
            bookshelfRepository.findByPublicId(publicId)
                ?: run {
                    logger.warn { "${logContext("deleteBookshelf")} Delete failed — bookshelf not found: publicId=$publicId" }
                    return BookshelfError.NotFoundByPublicId(publicId).left()
                }

        val deleteCount = bookService.deleteBooksInBookshelf(bookshelf.id)
        bookshelfRepository.deleteById(bookshelf.id)
        logger.info { "${logContext("deleteBookshelf")} Deleted bookshelf and $deleteCount books: publicId=$publicId" }
        return deleteCount.right()
    }
}
