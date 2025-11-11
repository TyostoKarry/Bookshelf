import { type FC, useState, useEffect, useCallback } from "react";
import { toast } from "sonner";
import { ModalBase } from "./ModalBase";
import { searchOpenLibrary } from "../../api/openLibrary";
import { useLanguage } from "../../hooks/useLanguage";
import { useModal } from "../../hooks/useModal";
import type { OpenLibrarySearchBook } from "../../types/openLibrary";
import { Button } from "../commons/Button";

interface SearchOpenLibraryModalProps {
  onBookSelect: (book: OpenLibrarySearchBook) => void;
}

export const SearchOpenLibraryModal: FC<SearchOpenLibraryModalProps> = ({
  onBookSelect,
}) => {
  const { t } = useLanguage();
  const { closeModal } = useModal();

  const [query, setQuery] = useState("");
  const [results, setResults] = useState<OpenLibrarySearchBook[]>([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = useCallback(async () => {
    setLoading(true);
    try {
      const data = await searchOpenLibrary(query);
      setResults(data);
      if (data.length === 0) toast.error(t("toast.openLibraryNoResults"));
    } catch (error) {
      console.error("Error searching Open Library:", error);
      toast.error(t("toast.openLibrarySearchError"));
    } finally {
      setLoading(false);
    }
  }, [query, t]);

  const handleSelectBook = (book: OpenLibrarySearchBook) => {
    closeModal();
    onBookSelect(book);
  };

  useEffect(() => {
    const handleEnterKey = (event: KeyboardEvent) => {
      if (event.key === "Enter" && query.trim()) {
        handleSearch();
      }
    };
    document.addEventListener("keydown", handleEnterKey);
    return () => document.removeEventListener("keydown", handleEnterKey);
  }, [handleSearch, query]);

  return (
    <ModalBase>
      <h2 className="text-xl font-semibold text-text mb-3">
        {t("searchOpenLibrary.title")}
      </h2>
      <div className="flex gap-2 mb-4">
        <input
          type="text"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder={t("searchOpenLibrary.searchPlaceholder")}
          className="flex-1 border border-gray-300 rounded p-2 text-sm"
        />
        <Button
          label={t("button.search")}
          onClick={handleSearch}
          disabled={loading || !query.trim()}
        />
      </div>

      {loading && <p className="text-gray-600">{t("common.loading")}</p>}

      {!loading && results.length > 0 && (
        <ul className="max-h-96 overflow-y-auto space-y-2 mt-2">
          {results.map((book) => (
            <li
              key={book.key}
              className="flex gap-3 p-2 border border-gray-200 rounded-md hover:bg-gray-50 cursor-pointer"
              onClick={() => handleSelectBook(book)}
            >
              {book.coverUrl ? (
                <img
                  src={book.coverUrl}
                  alt={book.title}
                  className="w-12 h-16 object-cover rounded"
                />
              ) : (
                <div className="w-12 h-16 bg-gray-200 rounded"></div>
              )}
              <div className="flex flex-col justify-center text-left">
                <span className="font-semibold text-gray-800">
                  {book.title}
                </span>
                <span className="text-sm text-gray-600">
                  {book.authors.join(", ") ||
                    t("searchOpenLibrary.unknownAuthor")}
                </span>
                {book.publishYear && (
                  <span className="text-sm text-gray-500">
                    {`${t("searchOpenLibrary.firstPublished")}: ${book.publishYear}`}
                  </span>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </ModalBase>
  );
};
