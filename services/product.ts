import SubcategoryModel from "@models/subcategory";
import CategoryModel from "@models/category";
import ProductModel from "@models/product";
import { createHttpError } from "@utils/error";
import { Product } from "@prisma/client";
import supabase from "@utils/supabase";
import path from "path";
import { v4 as uuidv4 } from "uuid";

const SaveProduct = async (
  product: Product,
  mainImage: Express.Multer.File[],
  additionalImages: Express.Multer.File[]
) => {
  const subcategory = await SubcategoryModel.FindSubcategoryById(
    product.subcategoryId
  );

  if (!subcategory) {
    throw createHttpError(400, null, "Subcategory ID doesn't exist");
  }

  const imageUrls: string[] = [];
  const imagesToUpload = [...mainImage, ...additionalImages];

  for (const file of imagesToUpload) {
    const uuid = uuidv4();
    const fileName = `${uuid}${path.extname(file.originalname)}`;

    const { data: uploadData, error } = await supabase.storage
      .from("images")
      .upload(`products/${fileName}`, file.buffer, {
        contentType: file.mimetype,
      });

    if (error) {
      throw createHttpError(500, error, "Failed uploading to supabase");
    }

    const { data: imageUrl } = supabase.storage
      .from("images")
      .getPublicUrl(uploadData.path);

    imageUrls.push(imageUrl.publicUrl);
  }

  const newProduct = await ProductModel.SaveProduct(product, imageUrls);
  return newProduct;
};

const FindProductsBySubcategory = async (subcategoryId: string) => {
  const subcategory = await SubcategoryModel.FindSubcategoryById(subcategoryId);
  if (!subcategory) {
    throw createHttpError(400, null, "Subcategory ID doesn't exist");
  }

  const products = await ProductModel.FindProductsBySubcategory(subcategoryId);
  return products;
};

const FindProductsByCategory = async (categoryId: string) => {
  const category = await CategoryModel.FindCategoryById(categoryId);
  if (!category) {
    throw createHttpError(400, null, "Category ID doesn't exist");
  }

  const products = await ProductModel.FindProductsByCategory(categoryId);
  return products;
};

const FindFeaturedProducts = async () => {
  const products = await ProductModel.FindFeaturedProducts();
  return products;
};

const FindProduct = async (productId: string) => {
  const product = await ProductModel.FindProduct(productId);
  return product;
};

export default {
  SaveProduct,
  FindProductsBySubcategory,
  FindProductsByCategory,
  FindFeaturedProducts,
  FindProduct,
};
