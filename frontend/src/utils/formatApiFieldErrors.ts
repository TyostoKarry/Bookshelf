export function formatApiFieldErrors(
  fieldErrors: Record<string, string>,
): string {
  return Object.entries(fieldErrors)
    .map(([field, message]) => `${field}: ${message}`)
    .join(", ");
}
