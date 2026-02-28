import { useState, useEffect, type ReactNode } from "react";
import { toast } from "sonner";
import { MyBookshelfContext } from "./MyBookshelfContext";
import {
  getBookshelfByToken,
  getBooksInBookshelfByToken,
} from "../api/bookshelves";
import { useLanguage } from "../hooks/useLanguage";
import type { Book } from "../types/book";
import type { Bookshelf } from "../types/bookshelf";

export const MyBookshelfProvider = ({ children }: { children: ReactNode }) => {
  const [editToken, setEditToken] = useState<string | null>(() =>
    localStorage.getItem("editToken"),
  );
  const [bookshelf, setBookshelf] = useState<Bookshelf | null>(null);
  const [books, setBooks] = useState<Book[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const { t } = useLanguage();

  const refreshBookshelf = async () => {
    if (!editToken) return;

    setIsLoading(true);
    try {
      const fetchedBookshelf = await getBookshelfByToken(editToken);
      const fetchedBooks = await getBooksInBookshelfByToken(editToken);
      setBookshelf(fetchedBookshelf);
      setBooks(fetchedBooks || []);
    } catch (error) {
      console.error("Failed to refresh bookshelf:", error);
      toast.error(t("toast.failedToRefreshBookshelf"));
    } finally {
      setIsLoading(false);
    }
  };

  const clearBookshelf = () => {
    setBookshelf(null);
    setBooks([]);
    setEditToken(null);
    setIsLoading(false);
    localStorage.removeItem("editToken");
  };

  useEffect(() => {
    const init = async () => {
      if (editToken) {
        await refreshBookshelf();
      }
      setIsInitialized(true);
    };
    init();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editToken]);

  const value = {
    bookshelf,
    books,
    editToken,
    isInitialized,
    isLoading,
    setBookshelf,
    setBooks,
    setEditToken,
    refreshBookshelf,
    clearBookshelf,
  };

  return (
    <MyBookshelfContext.Provider value={value}>
      {children}
    </MyBookshelfContext.Provider>
  );
};
