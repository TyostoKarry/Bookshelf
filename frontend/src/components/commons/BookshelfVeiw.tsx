import { type FC, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { BookCard } from "./BookCard";
import { BookshelfToolbar } from "./BookshelfToolbar";
import { Button } from "./Button";
import { deleteBookshelf } from "../../api/bookshelves";
import CopyIcon from "../../assets/icons/copy.svg?react";
import { useLanguage } from "../../hooks/useLanguage";
import { useModal } from "../../hooks/useModal";
import type { Book } from "../../types/book";
import type { Bookshelf } from "../../types/bookshelf";
import { mergeOpenLibraryBook } from "../../utils/mergeOpenLibraryBook";

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
  const { openModal, closeModal } = useModal();
  const navigate = useNavigate();
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

  const handleCopyPublicId = async () => {
    try {
      await navigator.clipboard.writeText(bookshelf.publicId);
      toast.success(t("toast.publicIdCopied"));
    } catch (err) {
      console.error("Failed to copy public ID to clipboard:", err);
      toast.error(t("toast.publicIdCopyFailed"));
    }
  };

  const handleDeleteBookshelf = () => {
    openModal("CONFIRMATION", {
      title: t("modal.confirmationDeleteBookshelfTitle"),
      message: t("modal.confirmationDeleteBookshelfMessage"),
      confirmLabel: t("button.delete"),
      confirmColor: "danger",
      onConfirm: async () => {
        if (!editToken || !clearBookshelf) {
          toast.error(t("toast.errorOccurredWhileDeletingBookshelf"));
          closeModal();
          return;
        }
        try {
          await deleteBookshelf(bookshelf.publicId, editToken);
          toast.success(t("toast.bookshelfDeletedSuccessfully"));
          clearBookshelf();
          closeModal();
          navigate("/");
        } catch (error) {
          console.error(error);
          toast.error(t("toast.failedToDeleteBookshelf"));
          closeModal();
        }
      },
    });
  };

  return (
    <div className="w-full px-10 pb-10">
      <div className="max-w-3xl mx-auto pt-10 px-4">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
          <div className="text-center sm:text-left max-w-[70%]">
            <h1 className="text-3xl font-bold text-gray-900">
              {bookshelf.name}
            </h1>
            <div className="flex flex-row">
              <p className="text-sm text-gray-700 mt-1">
                Public ID:{" "}
                <span className="font-mono">{bookshelf.publicId}</span>
              </p>
              <button
                onClick={handleCopyPublicId}
                className="ml-2 p-1 rounded hover:bg-gray-200 hover:cursor-pointer active:bg-gray-300"
                title={t("button.copyPublicIdToClipboard")}
              >
                <CopyIcon className="w-5 h-5" />
              </button>
            </div>
            <p className="text-gray-700 mt-1">{bookshelf.description}</p>
          </div>
          {canEdit && (
            <div className="flex flex-col gap-3">
              <Button
                label={t("button.addBook")}
                onClick={() => {
                  navigate("/books/new");
                }}
              />
              <Button
                label={t("button.addFromOpenLibrary")}
                onClick={() =>
                  openModal("SEARCH_OPEN_LIBRARY", {
                    onBookSelect: (openLibBook) => {
                      const newBook = mergeOpenLibraryBook({}, openLibBook);
                      navigate(`/books/new`, {
                        state: { book: newBook },
                      });
                    },
                  })
                }
                color="neutral"
              />
              <Button
                label={t("button.deleteBookshelf")}
                onClick={handleDeleteBookshelf}
                color="danger"
              />
            </div>
          )}
        </div>
        <hr className="border-gray-300 mb-4" />
      </div>
      <div>
        <BookshelfToolbar
          filters={filters}
          onFilterChange={handleFilterChange}
          onSearchChange={(query) => handleFilterChange("searchQuery", query)}
          onSortChange={(value) => handleFilterChange("sort", value)}
          clearFilters={handleClearFilters}
        />
        <h2 className="text-2xl font-semibold text-gray-800 mb-2">
          {t("bookshelfView.books")}
        </h2>
        {books.length === 0 ? (
          <p>{t("bookshelfView.noBooks")}</p>
        ) : filteredBooks.length === 0 ? (
          <p>{t("bookshelfView.noBooksMatchFilters")}</p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-6 xl:gap-8">
            {filteredBooks.map((book) => (
              <BookCard key={book.id} book={book} canEdit={canEdit} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
