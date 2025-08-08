import { prismaAndroidMarrocos } from "@/prisma-servicos/android/marrocos/android-marrocos-client";

export const getResumo = async (op: number) =>
  prismaAndroidMarrocos.$queryRaw`exec resumoLidoEnviado ${op}`;
