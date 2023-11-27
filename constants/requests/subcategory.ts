import { z } from "zod";

export const SaveSubcategorySchema = z.object({
  name: z.string({
    invalid_type_error: "Name must be a string",
    required_error: "Name cannot be empty",
  }),
  categoryId: z
    .string({
      invalid_type_error: "Category ID must be a string",
      required_error: "Category ID cannot be empty",
    })
    .uuid({
      message: "Category ID is not a valid UUID",
    }),
});

export type SaveSubcategoryRequest = z.infer<typeof SaveSubcategorySchema>;
