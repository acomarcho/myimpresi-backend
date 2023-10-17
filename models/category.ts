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

export default {
  FindAllCategories,
  SaveCategory,
};
