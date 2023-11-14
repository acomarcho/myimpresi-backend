import ArticleModel from "@models/article";

const FindAllArticles = async () => {
  const articles = await ArticleModel.FindAllArticles();

  return {
    articles,
  };
};

export default {
  FindAllArticles,
};
