import BannerService from "@services/banner";

import { Request, Response } from "express";

const FindAllBanners = async (req: Request, res: Response) => {
  try {
    const data = await BannerService.FindAllBanners();
    res.status(200).json(data);
  } catch (e) {
    res.status(500).json({
      error: e,
    });
  }
};

const SaveBanner = async (req: Request, res: Response) => {
  try {
    const file = req.file;

    if (!file) {
      throw new Error("File is empty");
    }

    const newBanner = await BannerService.SaveBanner(file);

    res.status(200).json({
      data: newBanner,
    });
  } catch (e) {
    res.status(500).json({
      error: e,
    });
  }
};

export default {
  FindAllBanners,
  SaveBanner,
};
