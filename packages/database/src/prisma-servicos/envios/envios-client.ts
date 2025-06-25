import { Prisma, PrismaClient } from "@/generated/prisma/envios";

import type { DefaultArgs } from "@/generated/prisma/envios/runtime/library";

export type EnviosPrismaClient = Omit<
  PrismaClient<Prisma.PrismaClientOptions, never, DefaultArgs>,
  "$connect" | "$disconnect" | "$on" | "$transaction" | "$use" | "$extends"
>;

declare global {
  var prismaEnvios: PrismaClient | undefined;
}

export const prismaEnvios = global.prismaEnvios || new PrismaClient();

if (process.env.NODE_ENV !== "production") global.prismaEnvios = prismaEnvios;
