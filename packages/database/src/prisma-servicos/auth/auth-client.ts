import { Prisma, PrismaClient } from "@/generated/prisma/auth";
import type { DefaultArgs } from "@/generated/prisma/auth/runtime/library";

export type AuthPrismaClient = Omit<
  PrismaClient<Prisma.PrismaClientOptions, never, DefaultArgs>,
  "$connect" | "$disconnect" | "$on" | "$transaction" | "$use" | "$extends"
>;

declare global {
  var prismaAuth: PrismaClient | undefined;
}

export const prismaAuth = global.prismaAuth || new PrismaClient();

if (process.env.NODE_ENV !== "production") global.prismaAuth = prismaAuth;

export { PrismaClient };
