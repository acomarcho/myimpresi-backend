import prisma from "@utils/prisma";
import { redisClient } from "@utils/redis";
import { Subcategory } from "@prisma/client";

const SaveSubcategory = async (name: string, categoryId: string) => {
  const newSubcategory = await prisma.subcategory.create({
    data: {
      name: name,
      categoryId: categoryId,
    },
  });

  return newSubcategory;
};

const FindSubcategoryById = async (id: string) => {
  const unparsedSubcategory = await redisClient.get(`subcategories:${id}`);
  if (unparsedSubcategory) {
    const subcategory: Subcategory = JSON.parse(unparsedSubcategory);
    return subcategory;
  }

  const subcategory = await prisma.subcategory.findUnique({
    where: {
      id: id,
    },
  });
  await redisClient.setEx(
    `subcategories:${id}`,
    300,
    JSON.stringify(subcategory)
  );
  return subcategory;
};

export default {
  SaveSubcategory,
  FindSubcategoryById,
};
