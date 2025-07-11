import { prismaEnvios } from "@/prisma-servicos/envios/envios";
export const devolveEstadoDoItem = async (idItem: number) => {
  return await prismaEnvios.item.findUnique({
    where: { idItem },
    select: { inativo: true },
  });
};
