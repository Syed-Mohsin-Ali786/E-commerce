import type { Role, User } from "../../generated/prisma/client";
import { prisma } from "../../config/db.server";

export type CartItems = Record<string, number>;

export async function getUserById(id: string): Promise<User | null> {
  return prisma.user.findUnique({ where: { id } });
}

export async function upsertUserFromClerk(data: {
  id: string;
  email: string;
  name?: string | null;
  imageUrl?: string | null;
}): Promise<User> {
  return prisma.user.upsert({
    where: { id: data.id },
    create: {
      id: data.id,
      email: data.email,
      name: data.name ?? null,
      imageUrl: data.imageUrl ?? null,
    },
    update: {
      email: data.email,
      name: data.name ?? null,
      imageUrl: data.imageUrl ?? null,
    },
  });
}

export async function updateUserRole(id: string, role: Role): Promise<User> {
  return prisma.user.update({
    where: { id },
    data: { role },
  });
}

export async function getCartItems(userId: string): Promise<CartItems> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { cartItems: true },
  });
  if (!user?.cartItems || typeof user.cartItems !== "object") {
    return {};
  }
  return user.cartItems as CartItems;
}

export async function saveCartItems(
  userId: string,
  cartItems: CartItems,
): Promise<void> {
  await prisma.user.update({
    where: { id: userId },
    data: { cartItems },
  });
}
