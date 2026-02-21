package io.github.tyostokarry.bookshelf

import io.github.tyostokarry.bookshelf.config.FlywayTestConfig
import org.junit.jupiter.api.Test
import org.springframework.boot.test.context.SpringBootTest
import org.springframework.context.annotation.Import
import org.springframework.test.context.ActiveProfiles

@SpringBootTest
@ActiveProfiles("test")
@Import(FlywayTestConfig::class)
class BookshelfApplicationTests {
    @Test
    fun contextLoads() {}
}
