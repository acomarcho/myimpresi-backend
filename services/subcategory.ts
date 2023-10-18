import CategoryModel from "@models/category";
import SubcategoryModel from "@models/subcategory";
import { createHttpError } from "@utils/error";

const SaveSubcategory = async (name: string, categoryId: number) => {
  const category = await CategoryModel.FindCategoryById(categoryId);
  if (!category) {
    throw createHttpError(400, null, "Category ID doesn't exist");
  }

  const subcategory = await SubcategoryModel.SaveSubcategory(name, category.id);
  return subcategory;
};

export default {
  SaveSubcategory,
};
