import type { OpenLibraryImportBookDetails } from "../types/openlibrary";
import type { BookForm } from "../validation/bookFormSchema";

export function mergeOpenLibraryBook(
  draft: Partial<BookForm>,
  imported: OpenLibraryImportBookDetails,
): BookForm {
  return {
    ...draft,
    title: imported.title ?? draft.title ?? "",
    author: imported.authors?.join(", ") ?? draft.author ?? "",
    pages: draft.pages ?? null,
    coverUrl: imported.coverUrl ?? draft.coverUrl ?? null,
    description: imported.description ?? draft.description ?? null,
    publisher: draft.publisher ?? null,
    publishedDate: imported.publishYear
      ? `${imported.publishYear}-01-01`
      : (draft.publishedDate ?? null),
    isbn13: draft.isbn13 ?? null,
    genre: draft.genre ?? "UNKNOWN",
    language: draft.language ?? "UNKNOWN",
    status: draft.status ?? "WISHLIST",
    progress: draft.progress ?? null,
    startedAt: draft.startedAt ?? null,
    finishedAt: draft.finishedAt ?? null,
    readCount: draft.readCount ?? 0,
    rating: draft.rating ?? null,
    notes: draft.notes ?? null,
    favorite: draft.favorite ?? false,
  };
}
