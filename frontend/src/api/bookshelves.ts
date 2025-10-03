import { API_KEY, API_URL } from "./apiClient";
import { type ApiResponse } from "../types/api-response";
import { formatApiFieldErrors } from "../utils/formatApiFieldErrors";

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
