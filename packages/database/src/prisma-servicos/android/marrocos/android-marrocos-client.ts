import { PrismaClient } from "@/generated/prisma/android/marrocos";

declare global {
  var prismaAndroidMarrocos: PrismaClient | undefined;
}

export const prismaAndroidMarrocos =
  global.prismaAndroidMarrocos || new PrismaClient();

if (process.env.NODE_ENV !== "production")
  global.prismaAndroidMarrocos = prismaAndroidMarrocos;
