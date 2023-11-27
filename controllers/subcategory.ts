import SubcategoryService from "@services/subcategory";
import ProductService from "@services/product";
import { Request, Response } from "express";
import { SaveSubcategorySchema } from "@constants/requests";
import { createHttpZodError, handleError } from "@utils/error";

const SaveSubcategory = async (req: Request, res: Response) => {
  try {
    const parsedBody = SaveSubcategorySchema.safeParse(req.body);
    if (!parsedBody.success) {
      throw createHttpZodError(400, null, parsedBody.error);
    }

    const { name, categoryId } = parsedBody.data;

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

const FindAllSubcategories = async (_req: Request, res: Response) => {
  try {
    const subcategories = await SubcategoryService.FindAllSubcategories();

    res.status(200).json({
      data: subcategories,
    });
  } catch (e) {
    handleError(e, res);
  }
};

export default {
  SaveSubcategory,
  FindProductsBySubcategory,
  FindAllSubcategories,
};
