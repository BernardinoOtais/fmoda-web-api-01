import { prismaEnvios } from "@/prisma-servicos/envios/envios";

export const getEnvioDb = async (idEnvio: number) => {
  return await prismaEnvios.envio.findUnique({ where: { idEnvio } });
};
