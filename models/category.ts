import prisma from "@utils/prisma";

const FindAllCategories = async () => {
  const categories = await prisma.category.findMany();
  return categories;
};

export default {
  FindAllCategories,
};
