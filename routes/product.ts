import express from "express";
import ProductController from "@controllers/product";

import { upload } from "../middlewares/multer";
import { checkApiKey } from "../middlewares/api-key";

const router = express.Router();

// POST /product
router.post(
  "/",
  checkApiKey,
  upload.array("files"),
  ProductController.SaveProduct
);

export default router;
