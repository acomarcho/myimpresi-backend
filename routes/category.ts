import express from "express";
import CategoryController from "@controllers/category";

import { upload } from "../middlewares/multer";
import { checkApiKey } from "../middlewares/api-key";

const router = express.Router();

// GET /category
router.get("/", CategoryController.FindAllCategories);
router.post(
  "/",
  checkApiKey,
  upload.single("file"),
  CategoryController.SaveCategory
);

export default router;
