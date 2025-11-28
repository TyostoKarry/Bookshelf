package io.github.tyostokarry.bookshelf.entity

import jakarta.persistence.Column
import jakarta.persistence.Entity
import jakarta.persistence.EnumType
import jakarta.persistence.Enumerated
import jakarta.persistence.GeneratedValue
import jakarta.persistence.GenerationType
import jakarta.persistence.Id
import jakarta.persistence.Index
import jakarta.persistence.PreUpdate
import jakarta.persistence.Table
import java.time.LocalDate
import java.time.LocalDateTime

/**
 * Represents a book entry in a user's bookshelf.
 * Mapped to the "books" table in database.
 */
@Entity
@Table(name = "books", indexes = [Index(name = "idx_books_bookshelf_id", columnList = "bookshelfId")])
data class Book(
    /**
     * Auto-generated primary key identifier.
     */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Long = 0,
    /**
     * The ID of the bookshelf who owns this book.
     */
    var bookshelfId: Long,
    /**
     * Title of the book (required).
     */
    @Column(nullable = false)
    var title: String,
    /**
     * Author of the book (required).
     */
    @Column(nullable = false)
    var author: String,
    /**
     * Number of pages the book has (optional).
     */
    var pages: Int? = null,
    /**
     * URL to the book cover image (optional).
     */
    var coverUrl: String? = null,
    /**
     * A summary or description of the book (optional).
     */
    @Column(columnDefinition = "TEXT")
    var description: String? = null,
    /**
     * Publisher of the book (optional).
     */
    var publisher: String? = null,
    /**
     * The published date of the book (optional).
     */
    var publishedDate: LocalDate? = null,
    /**
     * ISBN-13 identifier (optional).
     * Useful for reliable book lookups and import/exports.
     */
    var isbn13: String? = null,
    /**
     * Main genre classification for the book.
     */
    @Enumerated(EnumType.STRING)
    var genre: Genre = Genre.UNKNOWN,
    /**
     * Language this book was read in.
     * Stored as a String enum in DB (e.g., ENGLISH, FINNISH).
     */
    @Enumerated(EnumType.STRING)
    var language: Language = Language.UNKNOWN,
    /**
     * Current reading status of the book.
     * WISHLIST (not started yet), READING, or COMPLETED.
     */
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    var status: BookStatus = BookStatus.WISHLIST,
    /**
     * Current reading progress (optional).
     * Represents the current page when status = READING.
     */
    var progress: Int? = null,
    /**
     * Date the user started reading this book (optional).
     */
    var startedAt: LocalDate? = null,
    /**
     * Date the user finished reading this book (optional).
     */
    var finishedAt: LocalDate? = null,
    /**
     * How many times this book has been fully read.
     * Example: 0 = not read, 1 = read once, 2 = read twice.
     */
    var readCount: Int = 0,
    /**
     * Users personal rating (0-10 scale) (optional).
     * Will be mapped to 0-5 star rating in the frontend (half stars supported).
     */
    var rating: Int? = null,
    /**
     * User's personal notes or thoughts about the book (optional).
     */
    @Column(columnDefinition = "TEXT")
    var notes: String? = null,
    /**
     * Favorite flag to highlight starred books.
     * Defaults to false.
     */
    var favorite: Boolean = false,
    /**
     * When this book entry was created in the database.
     * Set automatically on creation and never updated.
     */
    @Column(nullable = false, updatable = false)
    val createdAt: LocalDateTime = LocalDateTime.now(),
    /**
     * Last time this book entry was updated in the database.
     * Auto-updated right before saving changes.
     */
    @Column(nullable = false)
    var updatedAt: LocalDateTime = LocalDateTime.now(),
) {
    @PreUpdate
    fun onUpdate() {
        updatedAt = LocalDateTime.now()
    }
}

enum class BookStatus {
    WISHLIST,
    READING,
    COMPLETED,
}

enum class Genre {
    UNKNOWN,
    FICTION,
    NONFICTION,
    SCIFI,
    FANTASY,
    BIOGRAPHY,
    HISTORY,
    MYSTERY,
    THRILLER,
    ROMANCE,
    SCIENCE,
    TECHNOLOGY,
    OTHER,
}

enum class Language(
    val code: String,
    val displayName: String,
) {
    UNKNOWN("yy", "Unknown"),
    ENGLISH("en", "English"),
    FINNISH("fi", "Finnish"),
    GERMAN("de", "German"),
    FRENCH("fr", "French"),
    SPANISH("es", "Spanish"),
    SWEDISH("sv", "Swedish"),
    ITALIAN("it", "Italian"),
    JAPANESE("ja", "Japanese"),
    PORTUGUESE("pt", "Portuguese"),
    RUSSIAN("ru", "Russian"),
    CHINESE("zh", "Chinese"),
    HINDI("hi", "Hindi"),
    ARABIC("ar", "Arabic"),
    OTHER("xx", "Other"),
    ;

    companion object {
        fun fromCode(code: String): Language = Language.entries.find { it.code.equals(code, ignoreCase = true) } ?: UNKNOWN
    }
}
