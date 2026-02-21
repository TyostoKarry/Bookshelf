package io.github.tyostokarry.bookshelf

import io.github.tyostokarry.bookshelf.config.FlywayTestConfig
import io.github.tyostokarry.bookshelf.config.TestcontainersConfig
import org.junit.jupiter.api.Test
import org.springframework.boot.test.context.SpringBootTest
import org.springframework.context.annotation.Import
import org.springframework.test.context.ActiveProfiles

@SpringBootTest
@ActiveProfiles("test")
@Import(FlywayTestConfig::class, TestcontainersConfig::class)
class BookshelfApplicationTests {
    @Test
    fun contextLoads() {}
}
