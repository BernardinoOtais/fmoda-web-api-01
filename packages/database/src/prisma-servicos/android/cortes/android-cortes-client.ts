import { PrismaClient } from "@/generated/prisma/android/cortes";

declare global {
  var prismaAndroidCortes: PrismaClient | undefined;
}

export const prismaAndroidCortes =
  global.prismaAndroidCortes || new PrismaClient();

if (process.env.NODE_ENV !== "production")
  global.prismaAndroidCortes = prismaAndroidCortes;
