package io.github.tyostokarry.bookshelf.repository

import io.github.tyostokarry.bookshelf.entity.Bookshelf
import org.springframework.data.jpa.repository.JpaRepository

/**
 * Repository for accessing and managing Bookshelf entities.
 */
interface BookshelfRepository : JpaRepository<Bookshelf, Long> {
    /**
     * Finds bookshelf that is linked to given publicly facing id.
     *
     * @param publicId of the bookshelf
     * @return bookshelf that is linked with the publicId
     */
    fun findByPublicId(publicId: String): Bookshelf?

    /**
     * Finds bookshelf that is linked to given edit token.
     *
     * @param editToken of the bookshelf
     * @return bookshelf that is linked with the edit token
     */
    fun findByEditToken(editToken: String): Bookshelf?
}
