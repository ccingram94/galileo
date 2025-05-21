import { PrismaClient } from "@prisma/client";

// Create global prisma object to prevent multiple instances in development
const globalForPrisma = globalThis;

// Check if we already have a Prisma instance, if not create one
export const prisma = globalForPrisma.prisma || new PrismaClient();

// In development, attach the instance to the global object to prevent duplication
if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
