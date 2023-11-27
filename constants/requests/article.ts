import { z } from "zod";

export const SaveArticleSchema = z.object({
  title: z.string({
    invalid_type_error: "Title must be a string",
    required_error: "Title cannot be empty",
  }),
  content: z.string({
    invalid_type_error: "Content must be a string",
    required_error: "Content cannot be empty",
  }),
});

export type SaveArticleRequest = {
  title: string;
  content: string;
  file: Express.Multer.File;
};
