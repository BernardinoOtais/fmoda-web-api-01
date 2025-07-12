import { prismaEnvios } from "@/prisma-servicos/envios/envios";

export const verificoSeContainerTemConteudoDb = async (idContainer: number) =>
  await prismaEnvios.conteudo.findFirst({
    where: { idContainer },
  });
