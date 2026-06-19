import type { Order, OrderStatus, Prisma } from "../../generated/prisma/client";
import { prisma } from "../../config/db.server";

export type OrderItemInput = {
  productId: string;
  quantity: number;
  price: number;
};

export type CreateOrderInput = {
  userId: string;
  addressId: string;
  items: OrderItemInput[];
  amount: number;
  paymentMethod?: string;
};

export async function getOrdersByUser(userId: string) {
  return prisma.order.findMany({
    where: { userId },
    include: {
      address: true,
      items: { include: { product: true } },
    },
    orderBy: { createdAt: "desc" },
  });
}

export async function getOrdersForSeller(sellerId: string) {
  return prisma.order.findMany({
    where: {
      items: { some: { product: { sellerId } } },
    },
    include: {
      user: { select: { id: true, name: true, email: true } },
      address: true,
      items: {
        where: { product: { sellerId } },
        include: { product: true },
      },
    },
    orderBy: { createdAt: "desc" },
  });
}

export async function createOrder(data: CreateOrderInput): Promise<Order> {
  return prisma.order.create({
    data: {
      userId: data.userId,
      addressId: data.addressId,
      amount: data.amount,
      paymentMethod: data.paymentMethod ?? "COD",
      items: {
        create: data.items.map((item) => ({
          productId: item.productId,
          quantity: item.quantity,
          price: item.price,
        })),
      },
    },
  });
}

export async function updateOrderStatus(
  orderId: string,
  status: OrderStatus,
  sellerId?: string,
): Promise<Order | null> {
  if (sellerId) {
    const order = await prisma.order.findFirst({
      where: {
        id: orderId,
        items: { some: { product: { sellerId } } },
      },
    });
    if (!order) return null;
  }

  return prisma.order.update({
    where: { id: orderId },
    data: { status },
  });
}

export type OrderWithDetails = Prisma.OrderGetPayload<{
  include: {
    address: true;
    items: { include: { product: true } };
  };
}>;
