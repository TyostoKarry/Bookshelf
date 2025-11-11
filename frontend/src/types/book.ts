export const BOOK_STATUS_OPTIONS = [
  "WISHLIST",
  "READING",
  "COMPLETED",
] as const;

export type BookStatus = (typeof BOOK_STATUS_OPTIONS)[number];

export const GENRE_OPTIONS = [
  "UNKNOWN",
  "FICTION",
  "NONFICTION",
  "SCIFI",
  "FANTASY",
  "BIOGRAPHY",
  "HISTORY",
  "MYSTERY",
  "THRILLER",
  "ROMANCE",
  "SCIENCE",
  "TECHNOLOGY",
  "OTHER",
] as const;

export type Genre = (typeof GENRE_OPTIONS)[number];

export const LANGUAGE_OPTIONS = [
  "UNKNOWN",
  "ENGLISH",
  "FINNISH",
  "GERMAN",
  "FRENCH",
  "SPANISH",
  "SWEDISH",
  "ITALIAN",
  "JAPANESE",
  "PORTUGUESE",
  "RUSSIAN",
  "CHINESE",
  "HINDI",
  "ARABIC",
  "OTHER",
] as const;

export type Language = (typeof LANGUAGE_OPTIONS)[number];

export interface Book {
  id: number;
  bookshelfPublicId: string;

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
