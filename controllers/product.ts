import ProductService from "@services/product";
import { Request, Response } from "express";
import { SaveProductRequest } from "@constants/requests";
import { createHttpError, isHttpError } from "@utils/error";
import { Product } from "@prisma/client";

const SaveProduct = async (req: Request, res: Response) => {
  try {
    const file = req.files;

    if (!file) {
      throw createHttpError(400, null, "No file supplied");
    }

    const { product }: SaveProductRequest = req.body;

    if (!product) {
      throw createHttpError(400, null, "No product supplied");
    }

    const productObject: Product = JSON.parse(product);

    const newProduct = await ProductService.SaveProduct(
      productObject,
      file as Express.Multer.File[]
    );

    res.status(200).json({
      data: newProduct,
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
  SaveProduct,
};
