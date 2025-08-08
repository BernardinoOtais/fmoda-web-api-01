import { prismaAndroidMarrocos } from "@/prisma-servicos/android/marrocos/android-marrocos-client";

export const postJuntaCaixas = async (
  idEnvioMarrocosCaixas: number,
  idEnvioMarrocosPalete: number
) =>
  prismaAndroidMarrocos.$queryRaw`exec enviosMarrocosJuntaCaixas ${idEnvioMarrocosCaixas}, ${idEnvioMarrocosPalete}`;
