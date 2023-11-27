import ArticleService from "@services/article";
import { Request, Response } from "express";
import { createHttpError, createHttpZodError, handleError } from "@utils/error";
import { SaveArticleSchema } from "@constants/requests";
import { z } from "zod";

const FindAllArticles = async (_req: Request, res: Response) => {
  try {
    const data = await ArticleService.FindAllArticles();
    res.status(200).json(data);
  } catch (e) {
    handleError(e, res);
  }
};

const SaveArticle = async (req: Request, res: Response) => {
  try {
    const file = req.file;
    if (!file) {
      throw createHttpError(400, null, "No file supplied");
    }

    const parsedBody = SaveArticleSchema.safeParse(req.body);
    if (!parsedBody.success) {
      throw createHttpZodError(400, null, parsedBody.error);
    }
    const { title, content } = parsedBody.data;

    const newArticle = await ArticleService.SaveArticle({
      title,
      content,
      file,
    });

    res.status(200).json({
      data: newArticle,
    });
  } catch (e) {
    handleError(e, res);
  }
};

const FindArticleById = async (req: Request, res: Response) => {
  try {
    const schema = z.object({
      id: z
        .string({
          invalid_type_error: "ID must be a string",
          required_error: "ID is required",
        })
        .uuid({
          message: "ID must be a valid UUID",
        }),
    });
    const parsedParams = schema.safeParse(req.params);
    if (!parsedParams.success) {
      throw createHttpZodError(400, null, parsedParams.error);
    }

    const { id: articleId } = parsedParams.data;

    const data = await ArticleService.FindArticleById(articleId);
    res.status(200).json({
      data: data,
    });
  } catch (e) {
    handleError(e, res);
  }
};

export default {
  FindAllArticles,
  SaveArticle,
  FindArticleById,
};
