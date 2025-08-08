import { prismaAndroidMarrocos } from "@/prisma-servicos/android/marrocos/android-marrocos-client";

export const getPaletes = async (idEnvioMarrocos: number) =>
  prismaAndroidMarrocos.$queryRaw`exec enviosMarrocosListaPaletesPorEnvio ${idEnvioMarrocos}`;
