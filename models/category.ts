import prisma from "@utils/prisma";

const FindAllCategories = async () => {
  const categories = await prisma.category.findMany({
    orderBy: {
      rank: {
        sort: "asc",
        nulls: "last",
      },
    },
  });
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
