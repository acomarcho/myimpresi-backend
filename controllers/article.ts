import ArticleService from "@services/article";
import { Request, Response } from "express";
import { createHttpError, handleError } from "@utils/error";
import { SaveArticleRequest } from "@constants/requests";

const FindAllArticles = async (req: Request, res: Response) => {
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

    const { title, content }: SaveArticleRequest = req.body;

    if (!title) {
      throw createHttpError(400, null, "No title supplied");
    }

    if (!content) {
      throw createHttpError(400, null, "No content supplied");
    }

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
    const { id: articleId } = req.params;
    if (!articleId) {
      throw createHttpError(400, null, "ID is required");
    }

    const data = await ArticleService.FindArticleById(articleId);
    res.status(200).json(data);
  } catch (e) {
    handleError(e, res);
  }
};

export default {
  FindAllArticles,
  SaveArticle,
  FindArticleById,
};
