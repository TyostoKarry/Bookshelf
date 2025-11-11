import { API_KEY, API_URL } from "./apiClient";
import { type ApiResponse } from "../types/api-response";
import type { Book } from "../types/book";

export async function getBookById(bookId: string): Promise<Book | null> {
  const response = await fetch(`${API_URL}/books/${bookId}`, {
    headers: {
      "X-API-KEY": API_KEY,
    },
  });

  const json: ApiResponse<Book> = await response.json();

  if (json.error) {
    throw new Error(json.error.message);
  }

  if (!response.ok) {
    throw new Error("Failed to fetch book in bookshelf");
  }

  return json.data;
}
