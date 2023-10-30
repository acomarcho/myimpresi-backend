import prisma from "@utils/prisma";

import { redisClient } from "@utils/redis";
import { Category } from "@prisma/client";

const FindAllCategories = async () => {
  const unparsedCategories = await redisClient.get("categories");
  if (unparsedCategories) {
    const categories: Category[] = JSON.parse(unparsedCategories);
    return categories;
  }

  const categories = await prisma.category.findMany({
    orderBy: {
      rank: {
        sort: "asc",
        nulls: "last",
      },
    },
  });
  await redisClient.setEx("categories", 300, JSON.stringify(categories));
  return categories;
};

const FindCategoryById = async (id: string) => {
  const unparsedCategory = await redisClient.get(`categories:${id}`);
  if (unparsedCategory) {
    const category: Category = JSON.parse(unparsedCategory);
    return category;
  }

  const category = await prisma.category.findUnique({
    where: {
      id: id,
    },
  });
  await redisClient.setEx(`categories:${id}`, 300, JSON.stringify(category));
  return category;
};

const SaveCategory = async (
  name: string,
  isFeatured: boolean,
  path: string
) => {
  const newCategory = await prisma.category.create({
    data: {
      name: name,
      isFeatured: isFeatured,
      imagePath: path,
    },
  });

  return newCategory;
};

export type FeaturedCategories = {
  id: string;
  name: string;
  subcategory: {
    id: string;
    name: string;
    product: ({
      productImage: {
        id: string;
        path: string;
        productId: string;
      }[];
    } & {
      id: string;
      name: string;
      price: number;
      soldAmount: number;
      minimumOrder: number;
      description: string;
      subcategoryId: string;
      isFeaturedAtCategory: boolean;
    })[];
  }[];
}[];

const FindAllCategoryFeaturedProducts = async () => {
  const unparsedProducts = await redisClient.get(`featured-products`);
  if (unparsedProducts) {
    const products: FeaturedCategories = JSON.parse(unparsedProducts);
    return products;
  }

  const products = await prisma.category.findMany({
    select: {
      id: true,
      name: true,
      subcategory: {
        select: {
          id: true,
          name: true,
          product: {
            where: {
              isFeaturedAtCategory: true,
            },
            include: {
              productImage: true,
            },
          },
        },
      },
    },
  });
  await redisClient.setEx(
    `featured-products`,
    300,
    JSON.stringify(unparsedProducts)
  );
  return products;
};

export default {
  FindAllCategories,
  FindCategoryById,
  SaveCategory,
  FindAllCategoryFeaturedProducts,
};
