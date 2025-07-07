import { prismaEnvios } from "@/prisma-servicos/envios/envios";

export const getNumeroDeConteudosComEstaOpDb = async (
  listaContainers: number[],
  op: number
): Promise<number> =>
  await prismaEnvios.conteudo.count({
    where: {
      idContainer: { in: listaContainers },
      op,
    },
  });
