import type { OpenLibraryImportBookDetails } from "../types/openlibrary";
import type { BookForm } from "../validation/bookFormSchema";

export function mergeOpenLibraryBook(
  draft: BookForm,
  imported: OpenLibraryImportBookDetails,
): BookForm {
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
