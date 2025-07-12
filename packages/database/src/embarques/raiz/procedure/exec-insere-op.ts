import { prismaEnvios } from "@/prisma-servicos/envios/envios";

export const execInsereOpDb = async (op: number) =>
  await prismaEnvios.$queryRaw`exec inserirOp ${op}`;
