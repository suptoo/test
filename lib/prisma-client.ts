// Alternative Prisma client import with custom output path
import { PrismaClient } from "../prisma/generated/client"

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const prismaClient =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["query"] : [],
  })

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prismaClient
