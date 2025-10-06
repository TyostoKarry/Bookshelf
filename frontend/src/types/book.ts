export type BookStatus = "WISHLIST" | "READING" | "COMPLETED";

export type Genre =
  | "UNKNOWN"
  | "FICTION"
  | "NONFICTION"
  | "SCIFI"
  | "FANTASY"
  | "BIOGRAPHY"
  | "HISTORY"
  | "MYSTERY"
  | "THRILLER"
  | "ROMANCE"
  | "OTHER";

export type Language =
  | "UNKNOWN"
  | "ENGLISH"
  | "FINNISH"
  | "GERMAN"
  | "FRENCH"
  | "SPANISH"
  | "SWEDISH"
  | "ITALIAN"
  | "JAPANESE"
  | "PORTUGUESE"
  | "RUSSIAN"
  | "CHINESE"
  | "HINDI"
  | "ARABIC"
  | "OTHER";

export interface Book {
  id: string;
  bookshelfId: string;

  title: string;
  author: string;

  pages?: number | null;
  coverUrl?: string | null;
  description?: string | null;
  publisher?: string | null;
  publishedDate?: string | null;
  isbn13?: string | null;
  googleId?: string | null;
  genre: Genre;
  language: Language;
  status: BookStatus;

  progress?: number | null;
  startedAt?: string | null;
  finishedAt?: string | null;
  readCount: number;
  rating?: number | null;
  notes?: string | null;
  favorite: boolean;

  createdAt: string;
  updatedAt: string;
}
