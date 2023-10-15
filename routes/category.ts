import express from "express";
import CategoryController from "@controllers/category";

const router = express.Router();

// GET /category
router.get("/", CategoryController.FindAllCategories);

export default router;
