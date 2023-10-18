import prisma from "@utils/prisma";

const SaveSubcategory = async (name: string, categoryId: number) => {
  const newSubcategory = await prisma.subcategory.create({
    data: {
      name: name,
      categoryId: categoryId,
    },
  });

  return newSubcategory;
};

export default {
  SaveSubcategory,
};
