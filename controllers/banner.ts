import BannerService from "@services/banner";
import { Request, Response } from "express";
import { createHttpError, isHttpError } from "@utils/error";

const FindAllBanners = async (req: Request, res: Response) => {
  try {
    const data = await BannerService.FindAllBanners();
    res.status(200).json(data);
  } catch (e) {
    if (isHttpError(e)) {
      return res.status(e.status).json({
        error: e.error,
        message: e.message,
      });
    }
    res.status(500).json({
      error: e,
      message: "Internal server error",
    });
  }
};

const SaveBanner = async (req: Request, res: Response) => {
  try {
    const file = req.file;

    if (!file) {
      throw createHttpError(400, null, "No file supplied");
    }

    const newBanner = await BannerService.SaveBanner(file);

    res.status(200).json({
      data: newBanner,
    });
  } catch (e) {
    if (isHttpError(e)) {
      return res.status(e.status).json({
        error: e.error,
        message: e.message,
      });
    }
    res.status(500).json({
      error: e,
      message: "Internal server error",
    });
  }
};

export default {
  FindAllBanners,
  SaveBanner,
};
