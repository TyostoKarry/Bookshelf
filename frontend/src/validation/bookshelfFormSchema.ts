import { z } from "zod";

export const bookshelfFormSchema = z.object({
  name: z
    .string()
    .min(1, "Bookshelf name is required")
    .max(100, "Bookshelf name must be at most 100 characters"),
  description: z
    .string()
    .max(1000, "Description must be at most 1000 characters")
    .transform((value) => (value === "" ? null : value))
    .nullable()
    .optional(),
});

export type BookshelfForm = z.infer<typeof bookshelfFormSchema>;
