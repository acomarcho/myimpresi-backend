import SubcategoryModel from "@models/subcategory";
import CategoryModel from "@models/category";
import ProductModel from "@models/product";
import { createHttpError } from "@utils/error";
import { Product } from "@prisma/client";
import supabase from "@utils/supabase";
import path from "path";
import { v4 as uuidv4 } from "uuid";
import { FindProductsFilter } from "@constants/requests";

const SaveProduct = async (
  product: Product,
  mainImage: Express.Multer.File[],
  additionalImages: Express.Multer.File[] | undefined
) => {
  const subcategory = await SubcategoryModel.FindSubcategoryById(
    product.subcategoryId
  );

  if (!subcategory) {
    throw createHttpError(400, null, "Subcategory ID doesn't exist");
  }

  const imageUrls: string[] = [];
  let imagesToUpload = [...mainImage];
  if (additionalImages) {
    imagesToUpload = [...imagesToUpload, ...additionalImages];
  }

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

const FindPromoProducts = async () => {
  const products = await ProductModel.FindPromoProducts();
  return products;
};

const FindProducts = async (findProductsFilter: FindProductsFilter) => {
  const { products, productCount } = await ProductModel.FindProducts(
    findProductsFilter
  );

  const paginationData = {
    total: productCount,
    totalPages: Math.ceil(productCount / findProductsFilter.pageSize),
  };

  return { products, paginationData };
};

const FindSimilarProductsFromProductId = async (productId: string) => {
  const similarProducts = await ProductModel.FindSimilarProductsFromProductId(
    productId
  );

  return similarProducts;
};

export default {
  SaveProduct,
  FindProductsBySubcategory,
  FindProductsByCategory,
  FindFeaturedProducts,
  FindProduct,
  FindPromoProducts,
  FindProducts,
  FindSimilarProductsFromProductId,
};
