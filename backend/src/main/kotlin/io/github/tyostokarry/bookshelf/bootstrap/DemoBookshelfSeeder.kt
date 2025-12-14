package io.github.tyostokarry.bookshelf.bootstrap

import io.github.tyostokarry.bookshelf.config.AppProperties
import io.github.tyostokarry.bookshelf.entity.Book
import io.github.tyostokarry.bookshelf.entity.BookStatus
import io.github.tyostokarry.bookshelf.entity.Genre
import io.github.tyostokarry.bookshelf.entity.Language
import io.github.tyostokarry.bookshelf.repository.BookshelfRepository
import io.github.tyostokarry.bookshelf.service.BookService
import io.github.tyostokarry.bookshelf.service.BookshelfService
import org.slf4j.LoggerFactory
import org.springframework.boot.context.event.ApplicationReadyEvent
import org.springframework.context.event.EventListener
import org.springframework.stereotype.Component
import java.time.LocalDate

@Component
class DemoBookshelfSeeder(
    private val props: AppProperties,
    private val bookshelfRepository: BookshelfRepository,
    private val bookshelfService: BookshelfService,
    private val bookService: BookService,
) {
    private val log = LoggerFactory.getLogger(javaClass)

    @EventListener(ApplicationReadyEvent::class)
    fun seed() {
        val publicId = props.demoShelfPublicId
        if (!props.seedDemoShelf || publicId.isNullOrBlank()) {
            log.info("Demo bookshelf seeding disabled or publicID not set")
            return
        }

        val existingDemoBookshelf = bookshelfRepository.findByPublicId(publicId)
        if (existingDemoBookshelf != null) {
            log.info("Demo bookshelf exists: {}", publicId)
            return
        }

        val demoBookshelfName = "Demo Bookshelf"
        val demoBookshelfDescription = "Read-only demo: sample books to explore the app."
        val (_, bookshelf) =
            bookshelfService.createBookshelfWithPublicId(publicId, demoBookshelfName, demoBookshelfDescription)

        val demoBooks =
            listOf(
                Book(
                    bookshelfId = bookshelf.id,
                    title = "The Hobbit",
                    author = "J.R.R. Tolkien",
                    pages = 310,
                    coverUrl = "https://covers.openlibrary.org/b/id/6979861-L.jpg",
                    description = @Suppress("ktlint:standard:max-line-length")
                    "The Hobbit is a tale of high adventure, undertaken by a company of dwarves in search of dragon-guarded gold. A reluctant partner in this perilous quest is Bilbo Baggins, a comfort-loving unambitious hobbit, who surprises even himself by his resourcefulness and skill as a burglar. Encounters with trolls, goblins, dwarves, elves, and giant spiders, conversations with the dragon, Smaug, and a rather unwilling presence at the Battle of Five Armies are just some of the adventures that befall Bilbo. Bilbo Baggins has taken his place among the ranks of the immortals of children’s fiction. Written by Professor Tolkien for his children, The Hobbit met with instant critical acclaim when published.",
                    publisher = "George Allen & Unwin",
                    publishedDate = LocalDate.of(1937, 9, 21),
                    isbn13 = "9780048231277",
                    genre = Genre.FANTASY,
                    language = Language.ENGLISH,
                    status = BookStatus.COMPLETED,
                    progress = 310,
                    startedAt = LocalDate.of(2024, 7, 10),
                    finishedAt = LocalDate.of(2024, 7, 16),
                    readCount = 2,
                    rating = 10,
                    notes = "Timeless adventure.",
                    favorite = true,
                ),
                Book(
                    bookshelfId = bookshelf.id,
                    title = "The Shadow of the Gods",
                    author = "John Gwynne",
                    pages = 466,
                    coverUrl = "https://covers.openlibrary.org/b/id/12380838-L.jpg",
                    description = @Suppress("ktlint:standard:max-line-length")
                    "A century has passed since the gods fought and drove themselves to extinction. Now only their bones remain, promising great power to those brave enough to seek them out. As whispers of war echo cross the land of Vigrið, fate follows in the footsteps of three warriors: a huntress on a dangerous quest, a noblewoman pursuing battle fame and a thrall seeking vengeance among the mercenaries known as the Bloodsworn. All three will shape the fate of the world as it once more falls under the shadow of the gods.",
                    publisher = "Orbit Books",
                    publishedDate = LocalDate.of(2021, 5, 4),
                    isbn13 = "9780356514215",
                    genre = Genre.FICTION,
                    language = Language.ENGLISH,
                    status = BookStatus.READING,
                    progress = 274,
                    startedAt = LocalDate.of(2025, 6, 10),
                    finishedAt = null,
                    readCount = 0,
                    rating = 9,
                    favorite = true,
                    notes = null,
                ),
                Book(
                    bookshelfId = bookshelf.id,
                    title = "Sapiens: A Brief History of Humankind",
                    author = "Yuval Noah Harari",
                    pages = 464,
                    coverUrl = "https://covers.openlibrary.org/b/id/9137127-M.jpg",
                    description =
                        "Harari explores the history and impact of Homo sapiens, from the Cognitive Revolution to modern society.",
                    publisher = "Harper",
                    publishedDate = LocalDate.of(2014, 2, 10),
                    isbn13 = "9780771038518",
                    genre = Genre.NONFICTION,
                    language = Language.ENGLISH,
                    status = BookStatus.COMPLETED,
                    progress = 464,
                    startedAt = LocalDate.of(2023, 3, 2),
                    finishedAt = LocalDate.of(2023, 3, 28),
                    readCount = 1,
                    rating = 8,
                    notes = "Thought-provoking, broad survey.",
                    favorite = false,
                ),
                Book(
                    bookshelfId = bookshelf.id,
                    title = "Dune",
                    author = "Frank Herbert",
                    pages = 541,
                    coverUrl = "https://covers.openlibrary.org/b/id/15092781-M.jpg",
                    description = "On Arrakis, Paul Atreides becomes the figurehead of a struggle over spice and destiny.",
                    publisher = "Ace Books",
                    publishedDate = LocalDate.of(1965, 8, 1),
                    isbn13 = "9780441172719",
                    genre = Genre.SCIFI,
                    language = Language.ENGLISH,
                    status = BookStatus.WISHLIST,
                    progress = 0,
                    startedAt = null,
                    finishedAt = null,
                    readCount = 0,
                    rating = null,
                    notes = "Classic sci‑fi epic.",
                    favorite = false,
                ),
                Book(
                    bookshelfId = bookshelf.id,
                    title = "The Pragmatic Programmer",
                    author = "Andrew Hunt, David Thomas",
                    pages = 352,
                    coverUrl = "https://covers.openlibrary.org/b/id/15136784-M.jpg",
                    description = @Suppress("ktlint:standard:max-line-length")
                    "Ward Cunningham Straight from the programming trenches, The Pragmatic Programmer cuts through the increasing specialization and technicalities of modern software development to examine the core process--taking a requirement and producing working, maintainable code that delights its users. It covers topics ranging from personal responsibility and career development to architectural techniques for keeping your code flexible and easy to adapt and reuse. Read this book, and you’ll learn how to Fight software rot; Avoid the trap of duplicating knowledge; Write flexible, dynamic, and adaptable code; Avoid programming by coincidence; Bullet-proof your code with contracts, assertions, and exceptions; Capture real requirements; Test ruthlessly and effectively; Delight your users; Build teams of pragmatic programmers; and Make your developments more precise with automation. Written as a series of self-contained sections and filled with entertaining anecdotes, thoughtful examples, and interesting analogies, The Pragmatic Programmer illustrates the best practices and major pitfalls of many different aspects of software development. Whether you’re a new coder, an experienced program.",
                    publisher = "Addison‑Wesley",
                    publishedDate = LocalDate.of(1999, 10, 30),
                    isbn13 = "9780201616224",
                    genre = Genre.TECHNOLOGY,
                    language = Language.ENGLISH,
                    status = BookStatus.READING,
                    progress = 120,
                    startedAt = LocalDate.of(2025, 9, 18),
                    finishedAt = null,
                    readCount = 1,
                    rating = 9,
                    notes = "Great tips for teams and individuals.",
                    favorite = true,
                ),
                Book(
                    bookshelfId = bookshelf.id,
                    title = "The Name of the Wind",
                    author = "Patrick Rothfuss",
                    pages = 662,
                    coverUrl = "https://covers.openlibrary.org/b/id/12391248-M.jpg",
                    description = @Suppress("ktlint:standard:max-line-length")
                    "The Name of the Wind, also called The Kingkiller Chronicle: Day One, is a heroic fantasy novel written by American author Patrick Rothfuss. It is the first book in the ongoing fantasy trilogy The Kingkiller Chronicle. It was published on March 27, 2007, by DAW Books, the novel has been hailed as a masterpiece of high fantasy.",
                    publisher = "Gollancz",
                    publishedDate = LocalDate.of(2007, 3, 27),
                    isbn13 = "9781407234724",
                    genre = Genre.FANTASY,
                    language = Language.ENGLISH,
                    status = BookStatus.READING,
                    progress = 180,
                    startedAt = LocalDate.of(2024, 11, 2),
                    finishedAt = null,
                    readCount = 0,
                    rating = 6,
                    notes = "Paused due to pacing.",
                    favorite = false,
                ),
                Book(
                    bookshelfId = bookshelf.id,
                    title = "The Martian",
                    author = "Andy Weir",
                    pages = 387,
                    coverUrl = "https://covers.openlibrary.org/b/id/14641755-M.jpg",
                    description = "An astronaut stranded on Mars engineers a way to survive.",
                    publisher = "Crown Publishers",
                    publishedDate = LocalDate.of(2014, 2, 11),
                    isbn13 = "9780804139021",
                    genre = Genre.SCIFI,
                    language = Language.ENGLISH,
                    status = BookStatus.COMPLETED,
                    progress = 387,
                    startedAt = LocalDate.of(2022, 8, 1),
                    finishedAt = LocalDate.of(2022, 8, 5),
                    readCount = 2,
                    rating = 9,
                    notes = "Funny, tense, very readable.",
                    favorite = true,
                ),
                Book(
                    bookshelfId = bookshelf.id,
                    title = "The Girl with the Dragon Tattoo",
                    author = "Stieg Larsson",
                    pages = 486,
                    coverUrl = "https://covers.openlibrary.org/b/id/15145260-L.jpg",
                    description = "A journalist and a hacker investigate a decades‑old disappearance.",
                    publisher = "alfred a. knopf new york",
                    publishedDate = LocalDate.of(2010, 1, 1),
                    isbn13 = "9780307454546",
                    genre = Genre.MYSTERY,
                    language = Language.SWEDISH,
                    status = BookStatus.WISHLIST,
                    progress = 0,
                    startedAt = null,
                    finishedAt = null,
                    readCount = 0,
                    rating = null,
                    notes = "Nordic noir classic.",
                    favorite = false,
                ),
                Book(
                    bookshelfId = bookshelf.id,
                    title = "A Brief History of Time",
                    author = "Stephen Hawking",
                    pages = 212,
                    coverUrl = "https://covers.openlibrary.org/b/id/15139590-L.jpg",
                    description = @Suppress("ktlint:standard:max-line-length")
                    "Stephen Hawking's ‘A Brief History of Time* has become an international publishing phenomenon. Translated into thirty languages, it has sold over ten million copies worldwide and lives on as a science book that continues to captivate and inspire new readers each year. When it was first published in 1988 the ideas discussed in it were at the cutting edge of what was then known about the universe. In the intervening twenty years there have been extraordinary advances in the technology of observing both the micro- and macro-cosmic world. Indeed, during that time cosmology and the theoretical sciences have entered a new golden age . Professor Hawking is one of the major scientists and thinkers to have contributed to this renaissance.",
                    publisher = "Bantam Books",
                    publishedDate = LocalDate.of(1988, 4, 1),
                    isbn13 = "9780553380163",
                    genre = Genre.SCIENCE,
                    language = Language.ENGLISH,
                    status = BookStatus.WISHLIST,
                    progress = 0,
                    startedAt = null,
                    finishedAt = null,
                    readCount = 0,
                    rating = null,
                    notes = "Popular science milestone.",
                    favorite = false,
                ),
                Book(
                    bookshelfId = bookshelf.id,
                    title = "The Night Circus",
                    author = "Erin Morgenstern",
                    pages = 512,
                    coverUrl = "https://covers.openlibrary.org/b/id/14771917-M.jpg",
                    description = "Two magicians bound by a contest in a mysterious travelling circus.",
                    publisher = "Penguin Random House",
                    publishedDate = LocalDate.of(2011, 9, 13),
                    isbn13 = "9781446468265",
                    genre = Genre.ROMANCE,
                    language = Language.ENGLISH,
                    status = BookStatus.READING,
                    progress = 428,
                    startedAt = LocalDate.of(2025, 5, 2),
                    finishedAt = null,
                    readCount = 0,
                    rating = 7,
                    notes = "Atmospheric and dreamy.",
                    favorite = false,
                ),
                Book(
                    bookshelfId = bookshelf.id,
                    title = "The Art of War",
                    author = "Sun Tzu",
                    pages = 141,
                    coverUrl = "https://covers.openlibrary.org/b/id/14847775-M.jpg",
                    description = "Ancient Chinese treatise on strategy, applicable beyond warfare.",
                    publisher = "Clearbridge Pub.",
                    publishedDate = LocalDate.of(1999, 1, 1),
                    isbn13 = null,
                    genre = Genre.HISTORY,
                    language = Language.CHINESE,
                    status = BookStatus.COMPLETED,
                    progress = 141,
                    startedAt = LocalDate.of(2020, 3, 10),
                    finishedAt = LocalDate.of(2020, 3, 12),
                    readCount = 2,
                    rating = 8,
                    notes = "Timeless strategy insights.",
                    favorite = false,
                ),
                Book(
                    bookshelfId = bookshelf.id,
                    title = "Designing Data Intensive Applications",
                    author = "Martin Kleppmann",
                    pages = 614,
                    coverUrl = "https://covers.openlibrary.org/b/id/15096047-M.jpg",
                    description = @Suppress("ktlint:standard:max-line-length")
                    "Data is at the center of many challenges in system design today. Difficult issues need to be figured out, such as scalability, consistency, reliability, efficiency, and maintainability. In addition, we have an overwhelming variety of tools, including relational databases, NoSQL datastores, stream or batch processors, and message brokers. What are the right choices for your application? How do you make sense of all these buzzwords?",
                    publisher = "O'Reilly publications",
                    publishedDate = LocalDate.of(2017, 1, 1),
                    isbn13 = "9789352135240",
                    genre = Genre.TECHNOLOGY,
                    language = Language.ENGLISH,
                    status = BookStatus.COMPLETED,
                    progress = 614,
                    startedAt = LocalDate.of(2020, 5, 12),
                    finishedAt = LocalDate.of(2020, 8, 2),
                    readCount = 2,
                    rating = 10,
                    notes = "null",
                    favorite = true,
                ),
            )

        bookService.saveAllBooks(demoBooks)
        log.info("Demo bookshelf seeded with {} books. Demo Bookshelf publicID: {}", demoBooks.size, publicId)
    }
}
