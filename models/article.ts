import prisma from "@utils/prisma";

import { redisClient } from "@utils/redis";
import { Article } from "@prisma/client";

const redisKeys = {
  allArticles: "articles:all",
  article: (id: string) => `articles:${id}`,
};

const FindAllArticles = async () => {
  const unparsedArticles = await redisClient.get(redisKeys.allArticles);
  if (unparsedArticles) {
    const articles: Article[] = JSON.parse(unparsedArticles);
    return articles;
  }

  const articles = await prisma.article.findMany({
    orderBy: {
      rank: {
        sort: "asc",
        nulls: "last",
      },
    },
  });
  await redisClient.setEx(redisKeys.allArticles, 300, JSON.stringify(articles));
  return articles;
};

const SaveArticle = async (article: Article) => {
  const newArticle = await prisma.article.create({
    data: {
      title: article.title,
      content: article.content,
      imagePath: article.imagePath,
    },
  });

  return newArticle;
};

const FindArticleById = async (articleId: string) => {
  const redisKey = redisKeys.article(articleId);
  const unparsedArticle = await redisClient.get(redisKey);
  if (unparsedArticle) {
    const articles: Article = JSON.parse(unparsedArticle);
    return articles;
  }

  const article = await prisma.article.findUnique({
    where: {
      id: articleId,
    },
  });
  await redisClient.setEx(redisKey, 300, JSON.stringify(article));
  return article;
};

export default {
  FindAllArticles,
  SaveArticle,
  FindArticleById,
};
