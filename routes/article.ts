import express from "express";
import ArticleController from "@controllers/article";

const router = express.Router();

// GET /article
router.get("/", ArticleController.FindAllArticles);

export default router;
