import { useEffect, useState } from "react";
import { getBookshelfById, getBooksInBookshelfById } from "../api/bookshelves";
import { type Book } from "../types/book";
import { type Bookshelf } from "../types/bookshelf";

export const usePublicBookshelf = (id: string) => {
  const [bookshelf, setBookshelf] = useState<Bookshelf | null>(null);
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBookshelf = async () => {
      setLoading(true);
      setError(null);
      try {
        const fetchedBookshelf = await getBookshelfById(id);
        if (!fetchedBookshelf) {
          throw new Error("Bookshelf not found");
        }
        setBookshelf(fetchedBookshelf);
        const fetchedBooks = await getBooksInBookshelfById(id);
        setBooks(fetchedBooks || []);
      } catch (err) {
        setError((err as Error).message);
      }
      setLoading(false);
    };

    fetchBookshelf();
  }, [id]);

  return { bookshelf, books, loading, error };
};
