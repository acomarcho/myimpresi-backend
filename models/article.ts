import prisma from "@utils/prisma";

import { redisClient } from "@utils/redis";
import { Article } from "@prisma/client";

const redisKeys = {
  allArticles: "articles:all",
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

export default {
  FindAllArticles,
};
