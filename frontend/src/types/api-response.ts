import type { ApiErrorCode } from "./api-error-codes";

export interface ApiResponse<T> {
  data: T | null;
  error: ApiErrorResponse | null;
}

export interface ApiErrorResponse {
  message: string;
  code: ApiErrorCode;
  fieldErrors?: Record<string, string>;
}
