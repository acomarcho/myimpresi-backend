import SubcategoryService from "@services/subcategory";
import { Request, Response } from "express";
import { SaveSubcategoryRequest } from "@constants/requests";
import { createHttpError, isHttpError } from "@utils/error";

const SaveSubcategory = async (req: Request, res: Response) => {
  try {
    const { name, categoryId }: SaveSubcategoryRequest = req.body;
    if (!name) {
      throw createHttpError(400, null, "No name supplied");
    }
    if (!categoryId) {
      throw createHttpError(400, null, "No category ID supplied");
    }

    const subcategory = await SubcategoryService.SaveSubcategory(
      name,
      categoryId
    );

    res.status(200).json({
      data: subcategory,
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
  SaveSubcategory,
};
