package io.github.tyostokarry.bookshelf.repository

import io.github.tyostokarry.bookshelf.entity.Book
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Modifying
import org.springframework.transaction.annotation.Transactional

/**
 * Repository for accessing and managing Book entities.
 */
interface BookRepository : JpaRepository<Book, Long> {
    /**
     * Finds all books that belong to the given bookshelf ID.
     *
     * @param bookshelfId ID of the bookshelf
     * @return List of books in that bookshelf
     */
    fun findByBookshelfId(bookshelfId: Long): List<Book>

    /**
     * Deletes all books that belong to the given bookshelf ID.
     *
     * @param bookshelfId ID of the bookshelf
     * @return Number of rows deleted
     */
    @Modifying
    @Transactional
    fun deleteByBookshelfId(bookshelfId: Long): Long
}
