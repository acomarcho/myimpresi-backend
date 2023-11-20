import express from "express";
import ArticleController from "@controllers/article";

import { upload } from "../middlewares/multer";
import { checkApiKey } from "../middlewares/api-key";

const router = express.Router();

// GET /article
router.get("/", ArticleController.FindAllArticles);
// POST /article
router.post(
  "/",
  checkApiKey,
  upload.single("file"),
  ArticleController.SaveArticle
);
// GET /article/:id
router.get("/:id", ArticleController.FindArticleById);

export default router;
