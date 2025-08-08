import { prismaAndroidMarrocos } from "@/prisma-servicos/android/marrocos/android-marrocos-client";

export const getResumo = async (idEnvioMarrocos: number) =>
  prismaAndroidMarrocos.$queryRaw`exec enviosMarrocosFimResumo ${idEnvioMarrocos}`;
