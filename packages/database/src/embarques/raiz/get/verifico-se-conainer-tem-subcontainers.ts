import { prismaEnvios } from "@/prisma-servicos/envios/envios";

export const verificoSeContainerTemSubContainersDb = async (
  idContainer: number
) =>
  await prismaEnvios.container.findFirst({
    where: { idContainerPai: idContainer },
  });
