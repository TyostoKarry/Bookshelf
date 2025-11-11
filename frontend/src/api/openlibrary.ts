import type {
  OpenLibraryDoc,
  OpenLibrarySearchBook,
} from "../types/openLibrary";

export async function searchOpenLibrary(
  query: string,
): Promise<OpenLibrarySearchBook[]> {
  if (!query.trim()) return [];

  const response = await fetch(
    `https://openlibrary.org/search.json?q=${encodeURIComponent(query)}&limit=10`,
  );
  const json = await response.json();

  return (json.docs || []).map(
    (doc: OpenLibraryDoc): OpenLibrarySearchBook => ({
      key: doc.key,
      title: doc.title,
      authors: doc.author_name || [],
      publishYear: doc.first_publish_year || null,
      coverUrl: doc.cover_i
        ? `https://covers.openlibrary.org/b/id/${doc.cover_i}-L.jpg`
        : null,
    }),
  );
}
