import { prismaAndroidMarrocos } from "@/prisma-servicos/android/marrocos/android-marrocos-client";

export const getCaixas = async (idEnvioMarrocosPalete: number) =>
  prismaAndroidMarrocos.$queryRaw`exec enviosMarrocosListaCaixasPorPalete ${idEnvioMarrocosPalete}`;
