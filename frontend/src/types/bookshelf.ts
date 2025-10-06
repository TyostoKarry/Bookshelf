export interface Bookshelf {
  id: string;
  name: string;
  description: string | null;
}

export interface CreateBookshelfDto {
  name: string;
  description: string | null;
}

export interface NewBookshelf {
  id: string;
  name: string;
  description: string | null;
  editToken: string;
  createdAt: string;
  updatedAt: string;
}
