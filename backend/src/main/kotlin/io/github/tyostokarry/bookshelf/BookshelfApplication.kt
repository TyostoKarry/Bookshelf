package io.github.tyostokarry.bookshelf

import io.github.tyostokarry.bookshelf.config.AppProperties
import org.springframework.boot.autoconfigure.SpringBootApplication
import org.springframework.boot.context.properties.EnableConfigurationProperties
import org.springframework.boot.runApplication

@SpringBootApplication
@EnableConfigurationProperties(AppProperties::class)
class BookshelfApplication

fun main(args: Array<String>) {
    runApplication<BookshelfApplication>(*args)
}
