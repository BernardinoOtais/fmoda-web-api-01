import { prismaAndroidMarrocos } from "@/prisma-servicos/android/marrocos/android-marrocos-client";

export const deleteCaixaEDevolveLista = async (idEnvioMarrocosCaixas: number) =>
  prismaAndroidMarrocos.$queryRaw`exec enviosMarrocosApagaCaixaDevolveLista ${idEnvioMarrocosCaixas}`;
