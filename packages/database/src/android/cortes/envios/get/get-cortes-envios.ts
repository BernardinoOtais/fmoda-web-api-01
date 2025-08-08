import { prismaAndroidCortes } from "@/prisma-servicos/android/cortes/android-cortes-client";

export const getCortesEnvios = async (opIcf: string) =>
  prismaAndroidCortes.$queryRaw`exec listaEnvio ${opIcf}`;
