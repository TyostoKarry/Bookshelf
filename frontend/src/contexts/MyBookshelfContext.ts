import { createContext } from "react";
import type { Book } from "../types/book";
import type { Bookshelf } from "../types/bookshelf";

export interface MyBookshelfContextValue {
  bookshelf: Bookshelf | null;
  books: Book[];
  editToken: string | null;
  isInitialized: boolean;
  setBookshelf: (bookshelf: Bookshelf | null) => void;
  setBooks: (books: Book[]) => void;
  setEditToken: (editToken: string | null) => void;
  refreshBookshelf: () => Promise<void>;
  clearBookshelf: () => void;
}

export const MyBookshelfContext = createContext<
  MyBookshelfContextValue | undefined
>(undefined);
