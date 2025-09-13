import { PrismaClient } from "@/generated/prisma/android/marrocos";

declare global {
  var prismaAndroidMarrocos: PrismaClient | undefined;
}

export const prismaAndroidMarrocos =
  global.prismaAndroidMarrocos || new PrismaClient();

if (process.env.NODE_ENV !== "production")
  global.prismaAndroidMarrocos = prismaAndroidMarrocos;

prismaAndroidMarrocos.$extends({
  query: {
    // Apply to all models and operations
    $allModels: {
      async $allOperations({ args, query }) {
        try {
          return await query(args);
        } catch (err) {
          if (
            err instanceof Error &&
            err.message.includes("Timed out fetching a new connection")
          ) {
            throw new Error("Database connection timed out");
          }
          throw err;
        }
      },
    },
  },
});
