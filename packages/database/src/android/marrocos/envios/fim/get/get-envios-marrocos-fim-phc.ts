import { prismaAndroidMarrocos } from "@/prisma-servicos/android/marrocos/android-marrocos-client";

export const getEnvioMarrocosFimPhc = async (idEnvioMarrocos: number) =>
  prismaAndroidMarrocos.$queryRaw`exec enviosMarrocosFimGetPhc ${idEnvioMarrocos}`;
