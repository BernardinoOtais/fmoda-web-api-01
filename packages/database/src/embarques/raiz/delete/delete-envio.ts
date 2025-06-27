import { prismaEnvios } from "@/prisma-servicos/envios/envios";

export const deleteEnvioDb = async (idEnvio: number) => {
  return await prismaEnvios.envio.delete({ where: { idEnvio } });
};
