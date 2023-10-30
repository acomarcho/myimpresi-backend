import SubcategoryService from "@services/subcategory";
import ProductService from "@services/product";
import { Request, Response } from "express";
import { SaveSubcategoryRequest } from "@constants/requests";
import { createHttpError, handleError } from "@utils/error";

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
    handleError(e, res);
  }
};

const FindProductsBySubcategory = async (req: Request, res: Response) => {
  try {
    const { id: subcategoryId } = req.params;

    const products = await ProductService.FindProductsBySubcategory(
      subcategoryId
    );

    res.status(200).json({
      data: products,
    });
  } catch (e) {
    handleError(e, res);
  }
};

export default {
  SaveSubcategory,
  FindProductsBySubcategory,
};
