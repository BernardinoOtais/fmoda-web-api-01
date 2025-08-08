import { prismaAndroidMarrocos } from "@/prisma-servicos/android/marrocos/android-marrocos-client";

export const patchQuantidadeCaixa = async (
  idEnvioMarrocosCaixas: number,
  nomeUser: string,
  valorInserido: number
) =>
  prismaAndroidMarrocos.$queryRaw`exec enviosMarrocosAlteraQuantidadeDaCaixa ${idEnvioMarrocosCaixas}, ${nomeUser}, ${valorInserido}`;
