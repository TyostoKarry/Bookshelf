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
  const [filters, setFilters] = useState({
    genre: "",
    language: "",
    status: "",
    searchQuery: "",
    sort: "",
  });

  const handleFilterChange = (field: string, value: string | boolean) => {
    setFilters((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleClearFilters = () => {
    setFilters({
      genre: "",
      language: "",
      status: "",
      searchQuery: "",
      sort: "",
    });
  };

  const filteredBooks = useMemo(() => {
    let result = [...books];
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
        result.sort((a, b) => (a.rating ?? 0) - (b.rating ?? 0));
        break;
      case "ratingDesc":
        result.sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0));
        break;
      case "finishedAtAsc":
        result.sort((a, b) => {
          const aTime = a.finishedAt ? new Date(a.finishedAt).getTime() : 0;
          const bTime = b.finishedAt ? new Date(b.finishedAt).getTime() : 0;
          return aTime - bTime;
        });
        break;

      case "finishedAtDesc":
        result.sort((a, b) => {
          const aTime = a.finishedAt ? new Date(a.finishedAt).getTime() : 0;
          const bTime = b.finishedAt ? new Date(b.finishedAt).getTime() : 0;
          return bTime - aTime;
        });
        break;
      default:
        break;
    }

    return result;
  }, [books, filters]);

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
        onFilterChange={handleFilterChange}
        onSearchChange={(query) => handleFilterChange("searchQuery", query)}
        onSortChange={(value) => handleFilterChange("sort", value)}
        clearFilters={handleClearFilters}
      />
      <h2 className="text-2xl font-semibold text-foreground mb-2">
        {t("bookshelfView.books")}
      </h2>
      {books.length === 0 ? (
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
