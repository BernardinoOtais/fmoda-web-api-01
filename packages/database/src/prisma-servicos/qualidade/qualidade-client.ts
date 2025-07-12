import type { DefaultArgs } from "@/generated/prisma/qualidade/runtime/library";

import { Prisma, PrismaClient } from "@/generated/prisma/qualidade";

export type QualidadePrismaClient = Omit<
  PrismaClient<Prisma.PrismaClientOptions, never, DefaultArgs>,
  "$connect" | "$disconnect" | "$on" | "$transaction" | "$use" | "$extends"
>;

declare global {
  var prismaQualidade: PrismaClient | undefined;
}

export const prismaQualidade = global.prismaQualidade || new PrismaClient();

if (process.env.NODE_ENV !== "production")
  global.prismaQualidade = prismaQualidade;
