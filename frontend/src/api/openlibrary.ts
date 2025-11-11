import type {
  OpenLibrarySearchDoc,
  OpenLibrarySearchBook,
} from "../types/openlibrary";

export async function searchOpenLibrary(
  query: string,
): Promise<OpenLibrarySearchBook[]> {
  if (!query.trim()) return [];

  try {
    const response = await fetch(
      `https://openlibrary.org/search.json?q=${encodeURIComponent(query)}&limit=10`,
    );
    if (!response.ok) {
      console.error("Open Library search failed:", response.status);
      return [];
    }
    const json = await response.json();

    return (json.docs || []).map(
      (doc: OpenLibrarySearchDoc): OpenLibrarySearchBook => ({
        key: doc.key,
        title: doc.title,
        authors: doc.author_name || [],
        publishYear: doc.first_publish_year || null,
        coverUrl: doc.cover_i
          ? `https://covers.openlibrary.org/b/id/${doc.cover_i}-L.jpg`
          : null,
      }),
    );
  } catch (error) {
    console.error("Error searching Open Library:", error);
    return [];
  }
}

export async function getOpenLibraryWorkDescription(
  workKey: string,
): Promise<string | null> {
  try {
    const response = await fetch(`https://openlibrary.org${workKey}.json`);
    if (!response.ok) {
      console.error(
        "Open Library work description fetch failed:",
        response.status,
      );
      return null;
    }

    const json = await response.json();
    const description =
      typeof json.description === "string"
        ? json.description
        : (json.description?.value ?? null);
    return description;
  } catch (error) {
    console.error("Error fetching Open Library work description:", error);
    return null;
  }
}
