import ArticleModel from "@models/article";
import { Article } from "@prisma/client";
import { SaveArticleRequest } from "@constants/requests";
import supabase from "@utils/supabase";
import path from "path";
import { v4 as uuidv4 } from "uuid";
import { createHttpError } from "@utils/error";

const FindAllArticles = async () => {
  const articles = await ArticleModel.FindAllArticles();

  return {
    articles,
  };
};

const SaveArticle = async (req: SaveArticleRequest) => {
  const { title, content, file } = req;

  const uuid = uuidv4();
  const fileName = `${uuid}${path.extname(file.originalname)}`;

  const { data: uploadData, error } = await supabase.storage
    .from("images")
    .upload(`articles/${fileName}`, file.buffer, {
      contentType: file.mimetype,
    });

  if (error) {
    throw createHttpError(500, error, "Failed uploading to Supabase");
  }

  const { data: imageUrl } = supabase.storage
    .from("images")
    .getPublicUrl(uploadData.path);

  const articleToAdd: Article = {
    id: "",
    title: title,
    content: content,
    imagePath: imageUrl.publicUrl,
    rank: null,
  };

  const newArticle = await ArticleModel.SaveArticle(articleToAdd);

  return newArticle;
};

const FindArticleById = async (articleId: string) => {
  const article = await ArticleModel.FindArticleById(articleId);

  return article;
};

export default {
  FindAllArticles,
  SaveArticle,
  FindArticleById,
};
