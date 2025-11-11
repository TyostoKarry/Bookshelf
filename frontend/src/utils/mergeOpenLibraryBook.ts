import type { Book } from "../types/book";
import type { OpenLibraryImportBookDetails } from "../types/openlibrary";

export function mergeOpenLibraryBook(
  draft: Partial<Book>,
  imported: OpenLibraryImportBookDetails,
): Partial<Book> {
  return {
    ...draft,
    title: imported.title ?? draft.title,
    author: imported.authors?.join(", ") ?? draft.author,
    publishedDate: imported.publishYear
      ? `${imported.publishYear}-01-01`
      : (draft.publishedDate ?? null),
    coverUrl: imported.coverUrl ?? draft.coverUrl ?? null,
    description: imported.description ?? draft.description ?? null,
  };
}
