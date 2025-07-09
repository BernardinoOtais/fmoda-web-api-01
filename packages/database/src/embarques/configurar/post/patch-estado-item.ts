import { prismaEnvios } from "@/prisma-servicos/envios/envios";
export const patchEstadoItemDb = async (idItem: number, inativo: boolean) => {
  const resutltado = await prismaEnvios.item.update({
    where: { idItem },
    data: { inativo },
  });
  console.log("patchEstadoItemDb : ", idItem, inativo, resutltado);
};
