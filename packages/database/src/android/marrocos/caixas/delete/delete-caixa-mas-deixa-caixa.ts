import { prismaAndroidMarrocos } from "@/prisma-servicos/android/marrocos/android-marrocos-client";

export const deleteCaixaMasDeixaCaixa = async (idEnvioMarrocosCaixas: number) =>
  prismaAndroidMarrocos.$queryRaw`exec enviosMarrocosApagaCaixaMasDeixaCaixa ${idEnvioMarrocosCaixas}`;
