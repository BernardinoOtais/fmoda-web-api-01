import { prismaEnvios } from "@/prisma-servicos/envios/envios";

export const getOpDb = async (op: number) => {
  return await prismaEnvios.op.findMany({ where: { op } });
};
