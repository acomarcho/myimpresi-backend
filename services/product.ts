import SubcategoryModel from "@models/subcategory";
import ProductModel from "@models/product";
import { createHttpError } from "@utils/error";
import { Product } from "@prisma/client";

const SaveProduct = async (product: Product, images: Express.Multer.File[]) => {
  const subcategory = await SubcategoryModel.FindSubcategoryById(
    product.subcategoryId
  );

  if (!subcategory) {
    throw createHttpError(400, null, "Category ID doesn't exist");
  }
};

export default {
  SaveProduct,
};
