type PathImpl<T, key extends keyof T> = key extends string
  ? T[key] extends Record<string, unknown>
    ? `${key}` | `${key}.${PathImpl<T[key], keyof T[key]>}`
    : `${key}`
  : never;

export type Path<T> = PathImpl<T, keyof T>;
