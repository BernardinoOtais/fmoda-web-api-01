import { prismaAndroidMarrocos } from "@/prisma-servicos/android/marrocos/android-marrocos-client";

export const getEnvio = async (nomeEnvio: string) =>
  prismaAndroidMarrocos.$queryRaw`exec enviosMarrocosListaPorNome ${nomeEnvio}`;
