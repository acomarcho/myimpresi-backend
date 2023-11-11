import prisma from "@utils/prisma";
import { Prisma, Product, ProductImage } from "@prisma/client";
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
        isFeaturedAtCategory: product.isFeaturedAtCategory,
        colors: product.colors,
        material: product.material,
        size: product.size,
      },
    });

    let currIndex = 0;
    for (const imagePath of imagePaths) {
      await tx.productImage.create({
        data: {
          path: imagePath,
          productId: createdProduct.id,
          isMainImage: currIndex === 0,
        },
      });

      currIndex += 1;
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
      productImage: {
        orderBy: {
          isMainImage: "desc",
        },
      },
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
      productImage: {
        orderBy: {
          isMainImage: "desc",
        },
      },
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
      productImage: {
        orderBy: {
          isMainImage: "desc",
        },
      },
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
    include: {
      productImage: {
        orderBy: {
          isMainImage: "desc",
        },
      },
    },
  });
  await redisClient.setEx(redisKey, 300, JSON.stringify(product));
  return product;
};

const FindPromoProducts = async () => {
  const redisKey = `promo-products`;
  const unparsedProducts = await redisClient.get(redisKey);
  if (unparsedProducts) {
    const products: ProductWithProductImage[] = JSON.parse(unparsedProducts);
    return products;
  }

  const products = await prisma.product.findMany({
    where: {
      productPromo: {
        not: null,
      },
    },
    include: {
      productImage: {
        orderBy: {
          isMainImage: "desc",
        },
      },
    },
  });
  await redisClient.setEx(redisKey, 300, JSON.stringify(products));
  return products;
};

type FindProductsFilter = {
  page: number;
  pageSize: number;
  categoryId?: string;
  subcategoryId?: string;
  sort?: string;
  search?: string;
};

const findProductSorts = {
  recommendation: "RECOMMENDED",
  lowestPrice: "LOWEST_PRICE",
  highestPrice: "HIGHEST_PRICE",
};

const FindProducts = async (filter: FindProductsFilter) => {
  let whereFilter: Prisma.ProductWhereInput = {};
  if (filter.categoryId) {
    whereFilter = {
      ...whereFilter,
      subcategory: {
        category: {
          id: filter.categoryId,
        },
      },
    };
  }
  if (filter.subcategoryId) {
    whereFilter = {
      ...whereFilter,
      subcategory: {
        id: filter.subcategoryId,
      },
    };
  }
  if (filter.search) {
    whereFilter = {
      ...whereFilter,
      OR: [
        {
          name: {
            contains: filter.search,
            mode: "insensitive",
          },
        },
        {
          subcategory: {
            name: {
              contains: filter.search,
              mode: "insensitive",
            },
          },
        },
        {
          subcategory: {
            category: {
              name: {
                contains: filter.search,
                mode: "insensitive",
              },
            },
          },
        },
      ],
    };
  }

  let orderByFilter: Prisma.ProductOrderByWithRelationInput = {};
  if (filter.sort) {
    if (filter.sort === findProductSorts.recommendation) {
      orderByFilter = {
        rank: {
          sort: "asc",
          nulls: "last",
        },
      };
    } else if (filter.sort === findProductSorts.lowestPrice) {
      orderByFilter = {
        price: "asc",
      };
    } else if (filter.sort === findProductSorts.lowestPrice) {
      orderByFilter = {
        price: "desc",
      };
    }
  }

  const products = await prisma.product.findMany({
    where: whereFilter,
    orderBy: orderByFilter,
    include: {
      productImage: {
        orderBy: {
          isMainImage: "desc",
        },
      },
    },
    take: filter.pageSize,
    skip: (filter.page - 1) * filter.pageSize,
  });

  const productCount = await prisma.product.count({
    where: whereFilter,
  });

  return [products, productCount];
};

export default {
  SaveProduct,
  FindProductsBySubcategory,
  FindProductsByCategory,
  FindFeaturedProducts,
  FindProduct,
  FindPromoProducts,
  FindProducts,
};
