import BannerService from "@services/banner";
import { Request, Response } from "express";
import { createHttpError, handleError } from "@utils/error";

const FindAllBanners = async (req: Request, res: Response) => {
  try {
    const data = await BannerService.FindAllBanners();
    res.status(200).json(data);
  } catch (e) {
    handleError(e, res);
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
    handleError(e, res);
  }
};

export default {
  FindAllBanners,
  SaveBanner,
};
