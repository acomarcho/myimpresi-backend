import express from "express";
import CategoryController from "@controllers/category";

import { upload } from "../middlewares/multer";

const router = express.Router();

// GET /category
router.get("/", CategoryController.FindAllCategories);
router.post("/", upload.single("file"), CategoryController.SaveCategory);

export default router;
