import { prismaAndroidMarrocos } from "@/prisma-servicos/android/marrocos/android-marrocos-client";

export const deleteCaixasEDevolveLista = async (
  idEnvioMarrocosPalete: number,
  idEnvioMarrocosCaixas: string
) =>
  prismaAndroidMarrocos.$queryRaw`exec enviosMarrocosApagaCaixasDevolveLista ${idEnvioMarrocosPalete}, ${idEnvioMarrocosCaixas}`;
