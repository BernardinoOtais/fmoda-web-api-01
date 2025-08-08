import { prismaAndroidMarrocos } from "@/prisma-servicos/android/marrocos/android-marrocos-client";

export const getResetNumeroCaixas = async (idEnvioMarrocosPalete: number) =>
  prismaAndroidMarrocos.$queryRaw`exec enviosMarrocosResetNumeroCaixasPalete ${idEnvioMarrocosPalete}`;
