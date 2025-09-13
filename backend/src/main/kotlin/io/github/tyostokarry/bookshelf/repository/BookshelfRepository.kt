package io.github.tyostokarry.bookshelf.repository

import io.github.tyostokarry.bookshelf.entity.Bookshelf
import org.springframework.data.jpa.repository.JpaRepository

/**
 * Repository for accessing and managing Bookshelf entities.
 */
interface BookshelfRepository : JpaRepository<Bookshelf, Long>
