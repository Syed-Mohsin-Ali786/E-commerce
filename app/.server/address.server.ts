import type { Address } from "../../generated/prisma/client";
import { prisma } from "../../config/db.server";

export type AddressInput = {
  fullName: string;
  phoneNumber: string;
  area: string;
  city: string;
  state: string;
  pincode?: string;
};

export async function getAddressesByUser(userId: string): Promise<Address[]> {
  return prisma.address.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
  });
}

export async function getAddressById(
  id: string,
  userId: string,
): Promise<Address | null> {
  return prisma.address.findFirst({ where: { id, userId } });
}

export async function createAddress(
  userId: string,
  data: AddressInput,
): Promise<Address> {
  return prisma.address.create({
    data: { ...data, userId },
  });
}

export async function deleteAddress(
  id: string,
  userId: string,
): Promise<Address | null> {
  const address = await getAddressById(id, userId);
  if (!address) return null;
  return prisma.address.delete({ where: { id } });
}
