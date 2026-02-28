import { useEffect, useRef, type FC } from "react";
import { useLanguage } from "../../../hooks/useLanguage";
import type { OpenLibrarySearchBook } from "../../../types/openlibrary";
import { Button } from "@/components/ui/button";
import {
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";

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
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  if (selectedBookLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-10 gap-3">
        <div className="h-10 w-10 border-4 border-muted-foreground border-t-transparent rounded-full animate-spin" />
        <p className="text-foreground">
          {t("searchOpenLibrary.loadingBookDetails")}
        </p>
      </div>
    );
  }

  return (
    <div>
      <DialogHeader>
        <DialogTitle className="text-center text-lg text-foreground text-shadow-md">
          {t("searchOpenLibrary.title")}
        </DialogTitle>
        <DialogDescription className="text-center text-muted-foreground mb-3">
          {t("searchOpenLibrary.description")}
        </DialogDescription>
      </DialogHeader>
      <form
        className="flex gap-2 mb-4"
        onSubmit={(event) => {
          event.preventDefault();
          onSearch();
        }}
      >
        <Input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder={t("searchOpenLibrary.searchPlaceholder")}
          className="w-full"
        />
        <Button
          type="submit"
          variant="default"
          className="hover:cursor-pointer"
          disabled={searchLoading || !query.trim()}
        >
          {t("button.search")}
        </Button>
      </form>

      {searchLoading && (
        <div
          role="status"
          aria-live="polite"
          className="flex flex-col items-center justify-center py-10 gap-3"
        >
          <div className="flex items-center justify-center">
            <Spinner className="size-12" />
          </div>
          <p className="text-muted-foreground">{t("common.loading")}</p>
        </div>
      )}

      {!searchLoading && results.length > 0 && (
        <ul className="max-h-96 overflow-y-auto space-y-2 mt-2">
          {results.map((bookFromList) => (
            <li
              key={bookFromList.key}
              tabIndex={0}
              className="flex gap-3 p-2 border border-muted-foreground rounded-md hover:bg-accent/30 cursor-pointer"
              onClick={() => onSelectBook(bookFromList)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  onSelectBook(bookFromList);
                }
              }}
            >
              {bookFromList.coverUrl ? (
                <img
                  src={bookFromList.coverUrl}
                  alt={bookFromList.title ?? t("common.unknown")}
                  className="w-20 h-28 object-cover rounded"
                />
              ) : (
                <div className="w-20 h-28 flex items-center justify-center bg-gray-200 rounded">
                  <p className="text-2xl text-muted-foreground">
                    {t("common.placeholderQuestionMark")}
                  </p>
                </div>
              )}
              <div className="flex-1 flex flex-col justify-center text-center">
                <span
                  className="font-semibold text-foreground line-clamp-2"
                  title={bookFromList.title ?? ""}
                >
                  {bookFromList.title}
                </span>
                {bookFromList.authors && (
                  <span
                    className="text-sm text-muted-foreground line-clamp-1"
                    title={bookFromList.authors.join(", ") ?? ""}
                  >
                    {bookFromList.authors.join(", ") ||
                      t("searchOpenLibrary.unknownAuthor")}
                  </span>
                )}
                {bookFromList.publishYear && (
                  <span className="text-sm text-muted-foreground">
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
          <p className="text-muted-foreground italic mt-6 text-center">
            {t("searchOpenLibrary.noResults")}
          </p>
        )}
    </div>
  );
};
