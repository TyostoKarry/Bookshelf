import { useEffect, useRef, type FC } from "react";
import CrossIcon from "../../../assets/icons/cross.svg?react";
import { useLanguage } from "../../../hooks/useLanguage";
import { useModal } from "../../../hooks/useModal";
import type { OpenLibrarySearchBook } from "../../../types/openlibrary";
import { Button } from "../../commons/Button";

interface OpenLibrarySearchListProps {
  query: string;
  setQuery: (query: string) => void;
  hasSearched: boolean;
  results: OpenLibrarySearchBook[];
  searchLoading: boolean;
  selectedBookLoading: boolean;
  onSearch: () => void;
  onSelectBook: (book: OpenLibrarySearchBook) => void;
}

export const OpenLibrarySearchList: FC<OpenLibrarySearchListProps> = ({
  query,
  setQuery,
  hasSearched,
  results,
  searchLoading,
  selectedBookLoading,
  onSearch,
  onSelectBook,
}) => {
  const { t } = useLanguage();
  const { closeModal } = useModal();
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  if (selectedBookLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-10 gap-3">
        <div className="h-10 w-10 border-4 border-gray-400 border-t-transparent rounded-full animate-spin" />
        <p className="text-gray-600">
          {t("searchOpenLibrary.loadingBookDetails")}
        </p>
      </div>
    );
  }

  return (
    <div className="relative">
      <button
        onClick={closeModal}
        aria-label={t("common.close")}
        className="absolute top-0 right-0 text-gray-700 hover:text-gray-900 hover:bg-gray-200 rounded-xl p-1 transition-colors active:scale-95"
      >
        <CrossIcon width={22} height={22} strokeWidth={2.5} />
      </button>
      <h2 className="text-xl font-semibold text-text mb-3">
        {t("searchOpenLibrary.title")}
      </h2>
      <form
        className="flex gap-2 mb-4"
        onSubmit={(event) => {
          event.preventDefault();
          onSearch();
        }}
      >
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder={t("searchOpenLibrary.searchPlaceholder")}
          className="flex-1 border border-gray-300 rounded p-2 text-sm"
        />
        <Button
          type="submit"
          label={t("button.search")}
          disabled={searchLoading || !query.trim()}
        />
      </form>

      {searchLoading && (
        <div className="flex flex-col items-center justify-center py-10 gap-3">
          <div className="h-10 w-10 border-4 border-gray-400 border-t-transparent rounded-full animate-spin" />
          <p className="text-gray-600">{t("common.loading")}</p>
        </div>
      )}

      {!searchLoading && results.length > 0 && (
        <ul className="max-h-96 overflow-y-auto space-y-2 mt-2">
          {results.map((bookFromList) => (
            <li
              key={bookFromList.key}
              className="flex gap-3 p-2 border border-gray-200 rounded-md hover:bg-gray-50 cursor-pointer"
              onClick={() => onSelectBook(bookFromList)}
            >
              {bookFromList.coverUrl ? (
                <img
                  src={bookFromList.coverUrl}
                  alt={bookFromList.title ?? t("common.unknown")}
                  className="w-20 h-28 object-cover rounded"
                />
              ) : (
                <div className="w-20 h-28 flex items-center justify-center bg-gray-200 rounded">
                  <p className="text-2xl text-gray-400">
                    {t("common.placeholderQuestionMark")}
                  </p>
                </div>
              )}
              <div className="flex-1 flex flex-col justify-center text-center">
                <span className="font-semibold text-gray-800">
                  {bookFromList.title}
                </span>
                {bookFromList.authors && (
                  <span className="text-sm text-gray-600">
                    {bookFromList.authors.join(", ") ||
                      t("searchOpenLibrary.unknownAuthor")}
                  </span>
                )}
                {bookFromList.publishYear && (
                  <span className="text-sm text-gray-500">
                    {`${t("searchOpenLibrary.firstPublished")}: ${bookFromList.publishYear}`}
                  </span>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}

      {!searchLoading &&
        results.length === 0 &&
        query.trim() &&
        hasSearched && (
          <p className="text-gray-500 italic mt-6 text-center">
            {t("searchOpenLibrary.noResults")}
          </p>
        )}
    </div>
  );
};
