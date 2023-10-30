import ProductService from "@services/product";
import { Request, Response } from "express";
import { SaveProductRequest } from "@constants/requests";
import { createHttpError, handleError } from "@utils/error";
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
    handleError(e, res);
  }
};

const FindFeaturedProducts = async (req: Request, res: Response) => {
  try {
    const products = await ProductService.FindFeaturedProducts();

    res.status(200).json({
      data: products,
    });
  } catch (e) {
    handleError(e, res);
  }
};

const FindProduct = async (req: Request, res: Response) => {
  try {
    const { id: productId } = req.params;
    const product = await ProductService.FindProduct(productId);

    if (!product) {
      throw createHttpError(404, null, "Product ID not found");
    }

    res.status(200).json({
      data: product,
    });
  } catch (e) {
    handleError(e, res);
  }
};

export default {
  SaveProduct,
  FindFeaturedProducts,
  FindProduct,
};
