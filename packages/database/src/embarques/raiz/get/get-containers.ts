import { prismaEnvios } from "@/prisma-servicos/envios/envios";

export const getContainersDb = async (idEnvio: number) => {
  return await prismaEnvios.container.findMany({ where: { idEnvio } });
};
