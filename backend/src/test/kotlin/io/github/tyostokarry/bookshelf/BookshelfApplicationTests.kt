package io.github.tyostokarry.bookshelf

import org.junit.jupiter.api.Test
import org.springframework.boot.test.context.SpringBootTest
import org.springframework.test.context.ActiveProfiles

@SpringBootTest
@ActiveProfiles("test")
class BookshelfApplicationTests {
    @Test
    fun contextLoads() {}
}
