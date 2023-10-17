import express from "express";
import BannerController from "@controllers/banner";

import { upload } from "../middlewares/multer";
import { checkApiKey } from "../middlewares/api-key";

const router = express.Router();

// GET /banner
router.get("/", BannerController.FindAllBanners);
// POST /banner
router.post(
  "/",
  checkApiKey,
  upload.single("file"),
  BannerController.SaveBanner
);

export default router;
