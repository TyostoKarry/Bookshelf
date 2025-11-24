package io.github.tyostokarry.bookshelf.security

import org.springframework.security.crypto.argon2.Argon2PasswordEncoder
import org.springframework.stereotype.Component

@Component
class TokenHasher {
    private val delegate = Argon2PasswordEncoder(16, 32, 1, 65536, 3)

    fun hash(raw: String): String = delegate.encode(raw)

    fun match(
        raw: String,
        hashed: String,
    ): Boolean = delegate.matches(raw, hashed)
}
