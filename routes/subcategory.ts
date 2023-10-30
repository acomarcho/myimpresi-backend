import express from "express";
import SubcategoryController from "@controllers/subcategory";

import bodyParser from "body-parser";
import { checkApiKey } from "../middlewares/api-key";

const router = express.Router();

// POST /subcategory
router.post(
  "/",
  checkApiKey,
  bodyParser.json(),
  SubcategoryController.SaveSubcategory
);
// GET /subcategory/:id/product
router.get("/:id/product", SubcategoryController.FindProductsBySubcategory);

export default router;
