import ArticleService from "@services/article";
import { Request, Response } from "express";
import { createHttpError, handleError } from "@utils/error";

const FindAllArticles = async (req: Request, res: Response) => {
  try {
    const data = await ArticleService.FindAllArticles();
    res.status(200).json(data);
  } catch (e) {
    handleError(e, res);
  }
};

export default {
  FindAllArticles,
};
