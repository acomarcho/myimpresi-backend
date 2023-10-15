import CategoryModel from "@models/category";

const FindAllCategories = async () => {
  const categories = await CategoryModel.FindAllCategories();

  return {
    categories,
  };
};

export default {
  FindAllCategories,
};
