import type { Book } from "../types/book";
import type { OpenLibrarySearchBook } from "../types/openLibrary";

export function mergeOpenLibraryBook(
  draft: Partial<Book>,
  imported: OpenLibrarySearchBook,
): Partial<Book> {
  return {
    ...draft,
    title: imported.title ?? draft.title,
    author: imported.authors?.join(", ") ?? draft.author,
    publishedDate: imported.publishYear
      ? `${imported.publishYear}-01-01`
      : (draft.publishedDate ?? null),
    coverUrl: imported.coverUrl ?? draft.coverUrl ?? null,
  };
}
