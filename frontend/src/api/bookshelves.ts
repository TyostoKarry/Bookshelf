import { API_KEY, API_URL } from "./apiClient";
import { type ApiResponse } from "../types/api-response";
import type { Book } from "../types/book";
import type {
  Bookshelf,
  CreateBookshelfDto,
  NewBookshelf,
} from "../types/bookshelf";
import { formatApiFieldErrors } from "../utils/formatApiFieldErrors";

export async function createBookshelf(
  data: CreateBookshelfDto,
): Promise<NewBookshelf | null> {
  const response = await fetch(`${API_URL}/bookshelves`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-API-KEY": API_KEY,
    },
    body: JSON.stringify(data),
  });

  const json: ApiResponse<NewBookshelf> = await response.json();

  if (json.error) {
    if (json.error.fieldErrors) {
      const fieldErrors = formatApiFieldErrors(json.error.fieldErrors);
      throw new Error(`${json.error.message}: ${fieldErrors}`);
    }
    throw new Error(json.error.message);
  }

  if (!response.ok) {
    throw new Error("Failed to create bookshelf");
  }

  return json.data;
}

export async function createBookInBookshelf(
  bookshelfPublicId: string,
  bookshelfEditToken: string,
  bookData: Partial<Book>,
): Promise<Book | null> {
  const response = await fetch(
    `${API_URL}/bookshelves/${bookshelfPublicId}/books`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-API-KEY": API_KEY,
        "X-BOOKSHELF-TOKEN": bookshelfEditToken,
      },
      body: JSON.stringify(bookData),
    },
  );

  const json: ApiResponse<Book> = await response.json();

  if (json.error) {
    if (json.error.fieldErrors) {
      const fieldErrors = formatApiFieldErrors(json.error.fieldErrors);
      throw new Error(`${json.error.message}: ${fieldErrors}`);
    }
    throw new Error(json.error.message);
  }

  if (!response.ok) {
    throw new Error("Failed to create book in bookshelf");
  }

  return json.data;
}

export async function getBookshelfByPublicId(
  publicId: string,
): Promise<Bookshelf | null> {
  const response = await fetch(`${API_URL}/bookshelves/${publicId}`, {
    headers: {
      "X-API-KEY": API_KEY,
    },
  });

  const json: ApiResponse<Bookshelf> = await response.json();

  if (json.error) {
    throw new Error(json.error.message);
  }

  if (!response.ok) {
    throw new Error("Failed to fetch bookshelf");
  }

  return json.data;
}

export async function getBookshelfByToken(
  token: string,
): Promise<Bookshelf | null> {
  const response = await fetch(`${API_URL}/bookshelves/token/${token}`, {
    headers: {
      "X-API-KEY": API_KEY,
    },
  });

  const json: ApiResponse<Bookshelf> = await response.json();

  if (json.error) {
    throw new Error(json.error.message);
  }

  if (!response.ok) {
    throw new Error("Failed to fetch bookshelf");
  }

  return json.data;
}

export async function getBooksInBookshelfByPublicId(
  publicId: string,
): Promise<Book[] | null> {
  const response = await fetch(`${API_URL}/bookshelves/${publicId}/books`, {
    headers: {
      "X-API-KEY": API_KEY,
    },
  });

  const json: ApiResponse<Book[]> = await response.json();

  if (json.error) {
    throw new Error(json.error.message);
  }

  if (!response.ok) {
    throw new Error("Failed to fetch books in bookshelf");
  }

  return json.data;
}

export async function getBooksInBookshelfByToken(
  token: string,
): Promise<Book[] | null> {
  const response = await fetch(`${API_URL}/bookshelves/token/${token}/books`, {
    headers: {
      "X-API-KEY": API_KEY,
    },
  });

  const json: ApiResponse<Book[]> = await response.json();

  if (json.error) {
    throw new Error(json.error.message);
  }

  if (!response.ok) {
    throw new Error("Failed to fetch books in bookshelf");
  }

  return json.data;
}

export async function updateBookInBookshelf(
  bookshelfPublicId: string,
  bookshelfEditToken: string,
  bookId: number,
  updatedFields: Partial<Book>,
): Promise<Book | null> {
  const response = await fetch(
    `${API_URL}/bookshelves/${bookshelfPublicId}/books/${bookId}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "X-API-KEY": API_KEY,
        "X-BOOKSHELF-TOKEN": bookshelfEditToken,
      },
      body: JSON.stringify(updatedFields),
    },
  );

  const json: ApiResponse<Book> = await response.json();

  if (json.error) {
    if (json.error.fieldErrors) {
      const fieldErrors = formatApiFieldErrors(json.error.fieldErrors);
      throw new Error(`${json.error.message}: ${fieldErrors}`);
    }
    throw new Error(json.error.message);
  }

  if (!response.ok) {
    throw new Error("Failed to update book in bookshelf");
  }

  return json.data;
}
