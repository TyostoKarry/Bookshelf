package io.github.tyostokarry.bookshelf.util

import io.github.oshai.kotlinlogging.KLogger

inline fun <reified T> T.logContext(method: String) = "[${T::class.simpleName}.$method]"

fun String.masked(visibleChars: Int = 4): String =
    if (length <= visibleChars) {
        "****"
    } else {
        "*".repeat(8) + takeLast(visibleChars)
    }

fun KLogger.warnForbidden(
    method: String,
    publicId: String,
    token: String?,
) {
    warn {
        "[$method] Forbidden attempt on bookshelf: " +
            "publicId=$publicId, token=${token?.masked() ?: "null"}"
    }
}
