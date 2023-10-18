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

export default router;
