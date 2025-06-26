import { prismaEnvios } from "@/prisma-servicos/envios/envios";

export const getNumeroEnviosEstadoDb = (fechado: boolean): Promise<number> =>
  prismaEnvios.envio.count({
    where: { fechado },
  });
