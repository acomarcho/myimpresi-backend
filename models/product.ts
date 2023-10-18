import prisma from "@utils/prisma";
import { Product } from "@prisma/client";

const SaveProduct = async (product: Product, imagePaths: string[]) => {
  const newProduct = await prisma.$transaction(async (tx) => {
    const createdProduct = await tx.product.create({
      data: {
        name: product.name,
        price: product.price,
        soldAmount: product.soldAmount,
        minimumOrder: product.minimumOrder,
        description: product.description,
        subcategoryId: product.subcategoryId,
      },
    });

    for (const imagePath of imagePaths) {
      await tx.productImage.create({
        data: {
          path: imagePath,
          productId: createdProduct.id,
        },
      });
    }

    return createdProduct;
  });

  return newProduct;
};

export default {
  SaveProduct,
};
