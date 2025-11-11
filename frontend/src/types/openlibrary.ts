export type OpenLibrarySearchBook = {
  key: string;
  title: string;
  authors: string[];
  publishYear: string | null;
  coverUrl: string | null;
};

export type OpenLibraryDoc = {
  key: string;
  title: string;
  author_name?: string[];
  first_publish_year?: string;
  cover_i?: number;
};
