import type { Product } from "../../generated/prisma/client";
import { prisma } from "../../config/db.server";

export type ProductInput = {
  name: string;
  description: string;
  price: number;
  offerPrice: number;
  images: string[];
  category: string;
  sellerId: string;
};

export async function getAllProducts(): Promise<Product[]> {
  return prisma.product.findMany({ orderBy: { createdAt: "desc" } });
}

export async function getProductById(id: string): Promise<Product | null> {
  return prisma.product.findUnique({ where: { id } });
}

export async function getProductsBySeller(sellerId: string): Promise<Product[]> {
  return prisma.product.findMany({
    where: { sellerId },
    orderBy: { createdAt: "desc" },
  });
}

export async function createProduct(data: ProductInput): Promise<Product> {
  return prisma.product.create({ data });
}

export async function deleteProduct(
  id: string,
  sellerId: string,
): Promise<Product | null> {
  const product = await prisma.product.findFirst({
    where: { id, sellerId },
  });
  if (!product) return null;
  return prisma.product.delete({ where: { id } });
}
