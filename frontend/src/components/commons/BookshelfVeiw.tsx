import { type FC, useState, useMemo } from "react";
import { BookCard } from "./bookshelf/BookCard";
import { BookshelfHeader } from "./bookshelf/BookshelfHeader";
import { BookshelfToolbar } from "./bookshelf/BookshelfToolbar";
import { useLanguage } from "../../hooks/useLanguage";
import type { Book } from "../../types/book";
import type { Bookshelf } from "../../types/bookshelf";

interface BookshelfViewProps {
  bookshelf: Bookshelf;
  books: Book[];
  editToken?: string | null;
  canEdit: boolean;
  clearBookshelf?: () => void;
}

export const BookshelfView: FC<BookshelfViewProps> = ({
  canEdit,
  bookshelf,
  editToken = null,
  books,
  clearBookshelf,
}) => {
  const { t } = useLanguage();
  const displayBooks = useMemo(() => {
    const toTime = (book: Book) => {
      if (book.updatedAt) return new Date(book.updatedAt).getTime();
      if (book.createdAt) return new Date(book.createdAt).getTime();
      return 0;
    };
    return [...books].sort((a, b) => toTime(b) - toTime(a));
  }, [books]);
  const [filters, setFilters] = useState({
    year: "",
    genre: "",
    language: "",
    status: "",
    searchQuery: "",
    sort: "",
  });

  const availableYears = useMemo(() => {
    const years = new Set(
      books
        .map((b) => b.finishedAt && new Date(b.finishedAt).getFullYear())
        .filter(Boolean) as number[],
    );
    return [...years].sort((a, b) => b - a).map(String);
  }, [books]);

  const availableGenres = useMemo(() => {
    return [...new Set(books.map((b) => b.genre).filter(Boolean))] as string[];
  }, [books]);

  const availableLanguages = useMemo(() => {
    return [
      ...new Set(books.map((b) => b.language).filter(Boolean)),
    ] as string[];
  }, [books]);

  const handleFilterChange = (field: string, value: string | boolean) => {
    setFilters((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleClearFilters = () => {
    setFilters({
      year: "",
      genre: "",
      language: "",
      status: "",
      searchQuery: "",
      sort: "",
    });
  };

  const filteredBooks = useMemo(() => {
    let result = [...displayBooks];
    if (filters.year)
      result = result.filter((book) => {
        const bookYear = book.finishedAt
          ? new Date(book.finishedAt).getFullYear().toString()
          : "";
        return bookYear === filters.year;
      });
    if (filters.genre)
      result = result.filter((book) => book.genre === filters.genre);
    if (filters.language)
      result = result.filter((book) => book.language === filters.language);
    if (filters.status)
      result = result.filter((book) => book.status === filters.status);
    if (filters.searchQuery)
      result = result.filter((b) =>
        [b.title, b.author, b.isbn13, b.publisher]
          .filter(Boolean)
          .join(" ")
          .toLowerCase()
          .includes(filters.searchQuery.toLowerCase()),
      );
    switch (filters.sort) {
      case "favoritesFirst":
        result.sort((a, b) => Number(b.favorite) - Number(a.favorite));
        break;
      case "ratingAsc":
        result.sort((a, b) => {
          if (a.rating != null && b.rating != null) return a.rating - b.rating;
          if (a.rating == null && b.rating != null) return 1;
          if (a.rating != null && b.rating == null) return -1;
          return 0;
        });
        break;
      case "ratingDesc":
        result.sort((a, b) => {
          if (a.rating != null && b.rating != null) return b.rating - a.rating;
          if (a.rating == null && b.rating != null) return 1;
          if (a.rating != null && b.rating == null) return -1;
          return 0;
        });
        break;
      case "finishedAtAsc":
        result.sort((a, b) => {
          const aTime = a.finishedAt ? new Date(a.finishedAt).getTime() : null;
          const bTime = b.finishedAt ? new Date(b.finishedAt).getTime() : null;
          if (aTime != null && bTime != null) return aTime - bTime;
          if (aTime == null && bTime != null) return 1;
          if (aTime != null && bTime == null) return -1;
          return 0;
        });
        break;
      case "finishedAtDesc":
        result.sort((a, b) => {
          const aTime = a.finishedAt ? new Date(a.finishedAt).getTime() : null;
          const bTime = b.finishedAt ? new Date(b.finishedAt).getTime() : null;
          if (aTime != null && bTime != null) return bTime - aTime;
          if (aTime == null && bTime != null) return 1;
          if (aTime != null && bTime == null) return -1;
          return 0;
        });
        break;
      default:
        break;
    }

    return result;
  }, [displayBooks, filters]);

  return (
    <div className="max-w-8xl mx-auto py-6 px-16 space-y-10 min-h-screen">
      <BookshelfHeader
        bookshelf={bookshelf}
        canEdit={canEdit}
        editToken={editToken}
        clearBookshelf={clearBookshelf}
      />
      <BookshelfToolbar
        filters={filters}
        availableYears={availableYears}
        availableGenres={availableGenres}
        availableLanguages={availableLanguages}
        onFilterChange={handleFilterChange}
        onSearchChange={(query) => handleFilterChange("searchQuery", query)}
        onSortChange={(value) => handleFilterChange("sort", value)}
        clearFilters={handleClearFilters}
      />
      <h2 className="text-2xl font-semibold text-foreground mb-2">
        {t("bookshelfView.books")}
      </h2>
      {displayBooks.length === 0 ? (
        <p>{t("bookshelfView.noBooks")}</p>
      ) : filteredBooks.length === 0 ? (
        <p>{t("bookshelfView.noBooksMatchFilters")}</p>
      ) : (
        <div className="grid justify-center gap-5 sm:gap-6 grid-cols-[repeat(auto-fit,minmax(16rem,1fr))]">
          {filteredBooks.map((book) => (
            <BookCard key={book.id} book={book} canEdit={canEdit} />
          ))}
        </div>
      )}
    </div>
  );
};
