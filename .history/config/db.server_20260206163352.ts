// 1. Import the Options type along with the Client
import { PrismaClient, Prisma } from "../generated/prisma/client"; 

let prisma: PrismaClient;

declare global {
  var __db__: PrismaClient | undefined;
}

// 2. Define an empty options object with the correct internal type
const prismaOptions:  {} as Prisma.PrismaClientOptions;

if (process.env.NODE_ENV === "production") {
  prisma = new PrismaClient(prismaOptions);
} else {
  if (!global.__db__) {
    global.__db__ = new PrismaClient(prismaOptions);
  }
  prisma = global.__db__;
}

export { prisma };