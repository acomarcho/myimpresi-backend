import CategoryService from "@services/category";

import { Request, Response } from "express";

const FindAllCategories = async (req: Request, res: Response) => {
  try {
    const data = await CategoryService.FindAllCategories();
    res.status(200).json(data);
  } catch (e) {
    res.status(500).json({
      error: e,
    });
  }
};

type SaveCategoryRequest = {
  name: string;
};

const SaveCategory = async (req: Request, res: Response) => {
  try {
    const file = req.file;

    if (!file) {
      throw new Error("File is empty");
    }

    const { name }: SaveCategoryRequest = req.body;

    if (!name) {
      throw new Error("Name is empty");
    }

    const newCategory = await CategoryService.SaveCategory(file, name);

    res.status(200).json({
      data: newCategory,
    });
  } catch (e) {
    res.status(500).json({
      error: e,
    });
  }
};

export default {
  FindAllCategories,
  SaveCategory,
};
