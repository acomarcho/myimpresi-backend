import CategoryService from "@services/category";
import { Request, Response } from "express";
import { SaveCategoryRequest } from "@constants/requests";
import { createHttpError, isHttpError } from "@utils/error";

const FindAllCategories = async (req: Request, res: Response) => {
  try {
    const data = await CategoryService.FindAllCategories();
    res.status(200).json(data);
  } catch (e) {
    if (isHttpError(e)) {
      return res.status(e.status).json({
        error: e.error,
        message: e.message,
      });
    }
    res.status(500).json({
      error: e,
      message: "Internal server error",
    });
  }
};

const SaveCategory = async (req: Request, res: Response) => {
  try {
    const file = req.file;

    if (!file) {
      throw createHttpError(400, null, "No file supplied");
    }

    const { name }: SaveCategoryRequest = req.body;

    if (!name) {
      throw createHttpError(400, null, "No name supplied");
    }

    const newCategory = await CategoryService.SaveCategory(file, name);

    res.status(200).json({
      data: newCategory,
    });
  } catch (e) {
    if (isHttpError(e)) {
      return res.status(e.status).json({
        error: e.error,
        message: e.message,
      });
    }
    res.status(500).json({
      error: e,
      message: "Internal server error",
    });
  }
};

export default {
  FindAllCategories,
  SaveCategory,
};
