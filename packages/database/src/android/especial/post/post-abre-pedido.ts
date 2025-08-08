import { prismaAndroidMarrocos } from "@/prisma-servicos/android/marrocos/android-marrocos-client";

export const postAbreEnvio = async (idEnvioMarrocos: number) =>
  prismaAndroidMarrocos.$queryRaw`exec enviosMarrocosAbrePedido ${idEnvioMarrocos}`;
