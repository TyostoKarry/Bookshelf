import { type FC } from "react";
import { useLanguage } from "../../../hooks/useLanguage";
import type { OpenLibrarySearchBook } from "../../../types/openlibrary";
import { Button } from "../../commons/Button";

interface OpenLibrarySearchListProps {
  query: string;
  setQuery: (query: string) => void;
  results: OpenLibrarySearchBook[];
  loading: boolean;
  onSearch: () => void;
  onSelectBook: (book: OpenLibrarySearchBook) => void;
}

export const OpenLibrarySearchList: FC<OpenLibrarySearchListProps> = ({
  query,
  setQuery,
  results,
  loading,
  onSearch,
  onSelectBook,
}) => {
  const { t } = useLanguage();

  return (
    <>
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
          onClick={onSearch}
          disabled={loading || !query.trim()}
        />
      </div>

      {loading && <p className="text-gray-600">{t("common.loading")}</p>}

      {!loading && results.length > 0 && (
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
    </>
  );
};
