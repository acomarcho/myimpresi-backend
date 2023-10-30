import prisma from "@utils/prisma";
import { Product, ProductImage } from "@prisma/client";
import { redisClient } from "@utils/redis";

export type ProductWithProductImage = {
  productImage: ProductImage[];
} & Product;

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

const FindProductsBySubcategory = async (subcategoryId: string) => {
  const unparsedProducts = await redisClient.get(
    `subcategory:${subcategoryId}:products`
  );
  if (unparsedProducts) {
    const products: ProductWithProductImage[] = JSON.parse(unparsedProducts);
    return products;
  }

  const products = await prisma.product.findMany({
    where: {
      subcategoryId: subcategoryId,
    },
    include: {
      productImage: true,
    },
  });
  await redisClient.setEx(
    `subcategory:${subcategoryId}:products`,
    300,
    JSON.stringify(products)
  );
  return products;
};

const FindProductsByCategory = async (categoryId: string) => {
  const unparsedProducts = await redisClient.get(
    `category:${categoryId}:products`
  );
  if (unparsedProducts) {
    const products: ProductWithProductImage[] = JSON.parse(unparsedProducts);
    return products;
  }

  const products = await prisma.product.findMany({
    where: {
      subcategory: {
        categoryId: categoryId,
      },
    },
    include: {
      productImage: true,
    },
  });
  await redisClient.setEx(
    `category:${categoryId}:products`,
    300,
    JSON.stringify(products)
  );
  return products;
};

const FindFeaturedProducts = async () => {
  const redisKey = `featured-products`;
  const unparsedProducts = await redisClient.get(redisKey);
  if (unparsedProducts) {
    const products: ProductWithProductImage[] = JSON.parse(unparsedProducts);
    return products;
  }

  const products = await prisma.product.findMany({
    where: {
      isFeaturedAtCategory: true,
    },
    include: {
      productImage: true,
    },
  });
  await redisClient.setEx(redisKey, 300, JSON.stringify(products));
  return products;
};

const FindProduct = async (productId: string) => {
  const redisKey = `products:${productId}`;
  const unparsedProduct = await redisClient.get(redisKey);
  if (unparsedProduct) {
    const product: Product = JSON.parse(unparsedProduct);
    return product;
  }

  const product = await prisma.product.findUnique({
    where: {
      id: productId,
    },
  });
  await redisClient.setEx(redisKey, 300, JSON.stringify(product));
  return product;
};

export default {
  SaveProduct,
  FindProductsBySubcategory,
  FindProductsByCategory,
  FindFeaturedProducts,
  FindProduct,
};
