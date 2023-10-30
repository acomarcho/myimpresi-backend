import express from "express";
import CategoryController from "@controllers/category";

import { upload } from "../middlewares/multer";
import { checkApiKey } from "../middlewares/api-key";

const router = express.Router();

// GET /category
router.get("/", CategoryController.FindAllCategories);
// POST /category
router.post(
  "/",
  checkApiKey,
  upload.single("file"),
  CategoryController.SaveCategory
);
// GET /category/:id/product
router.get("/:id/product", CategoryController.FindProductsByCategory);

export default router;
