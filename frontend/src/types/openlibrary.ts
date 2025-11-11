export type OpenLibrarySearchDoc = {
  key: string;
  title: string;
  author_name?: string[];
  first_publish_year?: number;
  cover_i?: number;
};

export type OpenLibrarySearchBook = {
  key: string;
  title: string | null;
  authors: string[] | null;
  publishYear: number | null;
  coverUrl: string | null;
};

export interface OpenLibraryImportBookDetails extends OpenLibrarySearchBook {
  description: string | null;
}
