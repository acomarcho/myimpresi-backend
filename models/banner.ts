import prisma from "@utils/prisma";

import { redisClient } from "@utils/redis";
import { Banner } from "@prisma/client";

const FindAllBanners = async () => {
  const unparsedBanners = await redisClient.get("banners");
  if (unparsedBanners) {
    const banners: Banner[] = JSON.parse(unparsedBanners);
    return banners;
  }

  const banners = await prisma.banner.findMany({
    orderBy: {
      rank: {
        sort: "asc",
        nulls: "last",
      },
    },
  });
  await redisClient.setEx("banners", 300, JSON.stringify(banners));
  return banners;
};

const SaveBanner = async (path: string) => {
  const newBanner = await prisma.banner.create({
    data: {
      imagePath: path,
    },
  });

  return newBanner;
};

export default {
  FindAllBanners,
  SaveBanner,
};
