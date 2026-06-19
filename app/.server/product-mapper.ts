import type { Product } from "../../generated/prisma/client";

export type ClientProduct = {
  _id: string;
  userId: string;
  name: string;
  description: string;
  price: number;
  offerPrice: number;
  image: string[];
  category: string;
  date: number;
};

export function toClientProduct(product: Product): ClientProduct {
  return {
    _id: product.id,
    userId: product.sellerId,
    name: product.name,
    description: product.description,
    price: product.price,
    offerPrice: product.offerPrice,
    image: product.images,
    category: product.category,
    date: product.createdAt.getTime(),
  };
}

export function toClientProducts(products: Product[]): ClientProduct[] {
  return products.map(toClientProduct);
}
