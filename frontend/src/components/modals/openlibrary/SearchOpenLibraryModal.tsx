import { type FC, useState, useEffect, useCallback } from "react";
import { toast } from "sonner";
import {
  getOpenLibraryWorkDescription,
  searchOpenLibrary,
} from "../../../api/openlibrary";
import { useLanguage } from "../../../hooks/useLanguage";
import { useModal } from "../../../hooks/useModal";
import type {
  OpenLibraryImportBookDetails,
  OpenLibrarySearchBook,
} from "../../../types/openlibrary";
import { ModalBase } from "../ModalBase";
import { OpenLibraryBookDetails } from "./OpenLibraryBookDetails";
import { OpenLibrarySearchList } from "./OpenLibrarySearchList";

interface SearchOpenLibraryModalProps {
  onBookSelect: (book: OpenLibraryImportBookDetails) => void;
}

export const SearchOpenLibraryModal: FC<SearchOpenLibraryModalProps> = ({
  onBookSelect,
}) => {
  const { t } = useLanguage();
  const { closeModal } = useModal();

  const [query, setQuery] = useState("");
  const [results, setResults] = useState<OpenLibrarySearchBook[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedBook, setSelectedBook] =
    useState<OpenLibraryImportBookDetails | null>(null);

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

  const buildOpenLibraryImport = async (
    book: OpenLibrarySearchBook,
  ): Promise<OpenLibraryImportBookDetails> => {
    const description = await getOpenLibraryWorkDescription(book.key);
    return {
      key: book.key,
      title: book.title,
      authors: book.authors,
      coverUrl: book.coverUrl,
      publishYear: book.publishYear,
      description,
    };
  };

  const handleSelectBook = async (book: OpenLibrarySearchBook) => {
    setLoading(true);
    try {
      const importBook = await buildOpenLibraryImport(book);
      setSelectedBook(importBook);
    } catch (error) {
      console.error("Error fetching book details from Open Library:", error);
      toast.error(t("toast.openLibraryFetchBookError"));
      setSelectedBook(null);
    } finally {
      setLoading(false);
    }
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
      {!selectedBook ? (
        <OpenLibrarySearchList
          query={query}
          setQuery={setQuery}
          results={results}
          loading={loading}
          onSearch={handleSearch}
          onSelectBook={handleSelectBook}
        />
      ) : (
        <OpenLibraryBookDetails
          selectedBook={selectedBook}
          onBack={() => setSelectedBook(null)}
          onConfirm={(book) => {
            onBookSelect(book);
            closeModal();
          }}
        />
      )}
    </ModalBase>
  );
};
