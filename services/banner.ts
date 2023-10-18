import BannerModel from "@models/banner";
import supabase from "@utils/supabase";
import path from "path";
import { v4 as uuidv4 } from "uuid";
import { createHttpError } from "@utils/error";

const FindAllBanners = async () => {
  const banners = await BannerModel.FindAllBanners();

  return {
    banners,
  };
};

const SaveBanner = async (file: Express.Multer.File) => {
  const uuid = uuidv4();
  const fileName = `${uuid}${path.extname(file.originalname)}`;

  const { data: uploadData, error } = await supabase.storage
    .from("images")
    .upload(`banners/${fileName}`, file.buffer, {
      contentType: file.mimetype,
    });

  if (error) {
    throw createHttpError(500, error, "Failed uploading to Supabase");
  }

  const { data: imageUrl } = supabase.storage
    .from("images")
    .getPublicUrl(uploadData.path);

  const newBanner = await BannerModel.SaveBanner(imageUrl.publicUrl);

  return newBanner;
};

export default {
  FindAllBanners,
  SaveBanner,
};
