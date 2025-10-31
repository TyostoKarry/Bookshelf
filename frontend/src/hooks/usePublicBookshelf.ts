import { useEffect, useState } from "react";
import {
  getBookshelfByPublicId,
  getBooksInBookshelfByPublicId,
} from "../api/bookshelves";
import { type Book } from "../types/book";
import { type Bookshelf } from "../types/bookshelf";

export const usePublicBookshelf = (publicId: string) => {
  const [bookshelf, setBookshelf] = useState<Bookshelf | null>(null);
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBookshelf = async () => {
      setLoading(true);
      setError(null);
      try {
        const fetchedBookshelf = await getBookshelfByPublicId(publicId);
        if (!fetchedBookshelf) {
          throw new Error("Bookshelf not found");
        }
        setBookshelf(fetchedBookshelf);
        const fetchedBooks = await getBooksInBookshelfByPublicId(publicId);
        setBooks(fetchedBooks || []);
      } catch (err) {
        setError((err as Error).message);
      }
      setLoading(false);
    };

    fetchBookshelf();
  }, [publicId]);

  return { bookshelf, books, loading, error };
};
