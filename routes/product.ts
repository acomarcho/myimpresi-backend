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
// GET /product
router.get("/", ProductController.FindProducts);
// GET /product/featured
router.get("/featured", ProductController.FindFeaturedProducts);
// GET /product/promo
router.get("/promo", ProductController.FindPromoProducts);
// GET /product/:id
router.get("/:id", ProductController.FindProduct);
// GET /product/:id/similar-products
router.get(
  "/:id/similar-products",
  ProductController.FindSimilarProductsFromProductId
);

export default router;
