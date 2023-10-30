import CategoryModel from "@models/category";
import supabase from "@utils/supabase";
import path from "path";
import { v4 as uuidv4 } from "uuid";
import { createHttpError } from "@utils/error";

const FindAllCategories = async () => {
  const categories = await CategoryModel.FindAllCategories();

  return {
    categories,
  };
};

const SaveCategory = async (file: Express.Multer.File, name: string) => {
  const uuid = uuidv4();
  const fileName = `${uuid}${path.extname(file.originalname)}`;

  const { data: uploadData, error } = await supabase.storage
    .from("images")
    .upload(`categories/${fileName}`, file.buffer, {
      contentType: file.mimetype,
    });

  if (error) {
    throw createHttpError(500, error, "Failed uploading to Supabase");
  }

  const { data: imageUrl } = supabase.storage
    .from("images")
    .getPublicUrl(uploadData.path);

  const newCategory = await CategoryModel.SaveCategory(
    name,
    false,
    imageUrl.publicUrl
  );

  return newCategory;
};

const FindAllCategoryFeaturedProducts = async () => {
  const products = await CategoryModel.FindAllCategoryFeaturedProducts();
  return products;
};

export default {
  FindAllCategories,
  SaveCategory,
  FindAllCategoryFeaturedProducts,
};
