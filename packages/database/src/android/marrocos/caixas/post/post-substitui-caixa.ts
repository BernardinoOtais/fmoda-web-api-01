import { prismaAndroidMarrocos } from "@/prisma-servicos/android/marrocos/android-marrocos-client";

export const postSubstituiCaixa = async (
  idEnvioMarrocosCaixas: number,
  nomeUser: string,
  codIcf: string
) => {
  return await prismaAndroidMarrocos.$queryRaw`
    EXEC enviosMarrocosNovoCaixaParaSubstituir ${idEnvioMarrocosCaixas}, ${nomeUser}, ${codIcf}
  `;
};
