import express from "express";
import ProductController from "@controllers/product";

import { upload } from "../middlewares/multer";
import { checkApiKey } from "../middlewares/api-key";

const router = express.Router();

// POST /product
router.post(
  "/",
  checkApiKey,
  upload.fields([
    { name: "mainImage", maxCount: 1 },
    { name: "additionalImages", maxCount: 10 },
  ]),
  ProductController.SaveProduct
);
// GET /product/featured
router.get("/featured", ProductController.FindFeaturedProducts);
// GET /product/:id
router.get("/:id", ProductController.FindProduct);

export default router;
