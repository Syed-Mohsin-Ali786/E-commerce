// app/config/db.server.ts
import { PrismaClient, Prisma } from "../generated/prisma/client";

let prisma: PrismaClient;

declare global {
  var __db__: PrismaClient | undefined;
}

// Use "as any" or "as Prisma.PrismaClientOptions" to bypass the Subset restriction
const prismaOptions = {} as Prisma.PrismaClientOptions;

if (process.env.NODE_ENV === "production") {
  prisma = new PrismaClient(prismaOptions);
} else {
  if (!global.__db__) {
    global.__db__ = new PrismaClient(prismaOptions);
  }
  prisma = global.__db__;
}

export { prisma };