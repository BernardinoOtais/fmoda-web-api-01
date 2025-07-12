import { prismaEnvios } from "@/prisma-servicos/envios/envios";

export const verificoSeOItemJaFoiUsadoDb = async (idItem: number) => {
  return await prismaEnvios.conteudo.findFirst({
    where: { idItem },
  });
};
