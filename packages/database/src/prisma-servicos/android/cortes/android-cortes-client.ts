import { PrismaClient } from "@/generated/prisma/android/cortes";

declare global {
  var prismaAndroidCortes: PrismaClient | undefined;
}

export const prismaAndroidCortes =
  global.prismaAndroidCortes || new PrismaClient();

if (process.env.NODE_ENV !== "production")
  global.prismaAndroidCortes = prismaAndroidCortes;

prismaAndroidCortes.$extends({
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
