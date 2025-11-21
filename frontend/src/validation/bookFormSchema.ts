import { z } from "zod";
import {
  BOOK_STATUS_OPTIONS,
  GENRE_OPTIONS,
  LANGUAGE_OPTIONS,
} from "../types/book";

export const bookFormSchema = z.object({
  title: z
    .string()
    .min(1, "Book title is required")
    .max(255, "Book title is too long"),
  author: z
    .string()
    .min(1, "Author is required")
    .max(255, "Author is too long"),
  pages: z.preprocess(
    (value) => (value === "" ? null : value),
    z.coerce
      .number()
      .min(1, "Pages must be at least 1")
      .nullable()
      .default(null),
  ),
  coverUrl: z.preprocess(
    (v) => (v === "" ? null : v),
    z.url("Invalid URL format").nullable().optional().default(null),
  ),
  description: z.preprocess(
    (value) => (value === "" ? null : value),
    z
      .string()
      .max(1000, "Description must be at most 1000 characters")
      .nullable()
      .optional()
      .default(null),
  ),
  publisher: z.preprocess(
    (value) => (value === "" ? null : value),
    z
      .string()
      .max(100, "Publisher must be at most 100 characters")
      .nullable()
      .optional()
      .default(null),
  ),
  publishedDate: z.preprocess(
    (value) => (value === "" ? null : value),
    z
      .string()
      .regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format (YYYY-MM-DD)")
      .nullable()
      .optional()
      .default(null),
  ),
  isbn13: z.preprocess(
    (value) => (value === "" ? null : value),
    z
      .string()
      .regex(/^\d{13}$/, "ISBN must consist of exactly 13 numeric digits")
      .nullable()
      .optional()
      .default(null),
  ),
  genre: z.enum(GENRE_OPTIONS).default("UNKNOWN"),
  language: z.enum(LANGUAGE_OPTIONS).default("UNKNOWN"),
  status: z.enum(BOOK_STATUS_OPTIONS).default("WISHLIST"),
  progress: z.preprocess(
    (value) =>
      typeof value === "number" && Number.isNaN(value) ? null : value,
    z.number().nullable().optional().default(null),
  ),
  startedAt: z.preprocess(
    (value) => (value === "" ? null : value),
    z
      .string()
      .regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format (YYYY-MM-DD)")
      .nullable()
      .optional()
      .default(null),
  ),
  finishedAt: z.preprocess(
    (value) => (value === "" ? null : value),
    z
      .string()
      .regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format (YYYY-MM-DD)")
      .nullable()
      .optional()
      .default(null),
  ),
  readCount: z.preprocess(
    (value) => (typeof value === "number" && Number.isNaN(value) ? 0 : value),
    z.number().min(0, "Read count cannot be negative").default(0),
  ),
  rating: z
    .number()
    .min(0, "Rating must be at least 0")
    .max(10, "Rating must be at most 10")
    .nullable()
    .optional()
    .default(null),
  notes: z.preprocess(
    (value) => (value === "" ? null : value),
    z
      .string()
      .max(2000, "Notes must be at most 2000 characters")
      .nullable()
      .optional()
      .default(null),
  ),
  favorite: z.boolean().default(false),
});

export type BookForm = z.input<typeof bookFormSchema>;
