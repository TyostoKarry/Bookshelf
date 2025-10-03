package io.github.tyostokarry.bookshelf.config

import org.springframework.boot.context.properties.ConfigurationProperties

@ConfigurationProperties(prefix = "app")
data class AppProperties(
    val apiKey: String,
    val frontendUrl: String,
)
