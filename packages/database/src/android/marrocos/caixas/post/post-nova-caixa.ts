import { prismaAndroidMarrocos } from "@/prisma-servicos/android/marrocos/android-marrocos-client";

export const postNovaCaixa = async (
  idEnvioMarrocosPalete: string,
  nomeUser: string,
  codIcf: string
) => {
  return await prismaAndroidMarrocos.$queryRaw`
    EXEC enviosMarrocosNovoCaixa ${idEnvioMarrocosPalete}, ${nomeUser}, ${codIcf}
  `;
};
