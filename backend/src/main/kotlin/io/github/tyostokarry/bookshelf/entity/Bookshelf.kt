package io.github.tyostokarry.bookshelf.entity

import jakarta.persistence.Column
import jakarta.persistence.Entity
import jakarta.persistence.GeneratedValue
import jakarta.persistence.GenerationType
import jakarta.persistence.Id
import jakarta.persistence.PreUpdate
import jakarta.persistence.Table
import java.time.LocalDateTime

/**
 * Represents a collection of books owned by a person.
 */
@Entity
@Table(name = "bookshelves")
data class Bookshelf(
    /**
     * Auto-generated primary key identifier.
     */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Long = 0,
    /**
     * Publicly visible, random identifier that uniquely references this bookshelf.
     *
     * Generated once in the service layer (using NanoID) during creation,
     * and remains stable for the lifetime of the bookshelf. Used both for
     * sharing and as the public prefix in the owner’s edit token.
     */
    @Column(nullable = false, unique = true, updatable = false)
    val publicId: String,
    /**
     * Name of the bookshelf (e.g. "My Shelf", "Summer Reads").
     */
    @Column(nullable = false)
    var name: String,
    /**
     * Description of the bookshelf (optional).
     */
    var description: String? = null,
    /**
     * When the bookshelf was created.
     * Set automatically on creation and never updated.
     */
    @Column(nullable = false, updatable = false)
    val createdAt: LocalDateTime = LocalDateTime.now(),
    /**
     * When the bookshelf was last updated.
     * Auto-updated right before saving changes.
     */
    @Column(nullable = false)
    var updatedAt: LocalDateTime = LocalDateTime.now(),
    /**
     * Hashed edit token for bookshelf ownership verification.
     * The raw token is generated once, returned to the client, and never stored.
     * Only this Argon2 id hash is saved and used for future token validation.
     */
    @Column(nullable = false)
    var editTokenHash: String,
) {
    @PreUpdate
    fun onUpdate() {
        updatedAt = LocalDateTime.now()
    }
}
