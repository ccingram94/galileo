import { PrismaClient } from "@prisma/client";

// error handling when creating the client
let prisma;

try {
  // PrismaClient attached to the `global` object in development to prevent exhausting database connection limit.
  const globalForPrisma = global;

  prisma = globalForPrisma.prisma || new PrismaClient();

  if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
} catch (error) {
  console.error("Failed to initialize Prisma client:", error);
  throw error;
}

export default prisma;
