export interface Bookshelf {
  publicId: string;
  name: string;
  description: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateBookshelfDto {
  name: string;
  description: string | null;
}

export interface NewBookshelf {
  publicId: string;
  name: string;
  description: string | null;
  editToken: string;
  createdAt: string;
  updatedAt: string;
}
