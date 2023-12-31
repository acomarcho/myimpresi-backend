import CategoryService from "@services/category";
import ProductService from "@services/product";
import { Request, Response } from "express";
import { SaveCategoryRequest } from "@constants/requests";
import { createHttpError, handleError } from "@utils/error";

const FindAllCategories = async (req: Request, res: Response) => {
  try {
    const data = await CategoryService.FindAllCategories();
    res.status(200).json(data);
  } catch (e) {
    handleError(e, res);
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
    handleError(e, res);
  }
};

const FindProductsByCategory = async (req: Request, res: Response) => {
  try {
    const { id: categoryId } = req.params;

    const products = await ProductService.FindProductsByCategory(categoryId);

    res.status(200).json({
      data: products,
    });
  } catch (e) {
    handleError(e, res);
  }
};

export default {
  FindAllCategories,
  SaveCategory,
  FindProductsByCategory,
};
