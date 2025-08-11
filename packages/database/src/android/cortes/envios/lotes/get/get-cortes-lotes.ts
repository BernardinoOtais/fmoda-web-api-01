import { prismaAndroidCortes } from "@/prisma-servicos/android/cortes/android-cortes-client";

export const getCortesLotes = async (controlo: number, idEnvio: number) =>
  prismaAndroidCortes.$queryRaw`exec listaLotes ${controlo}, ${idEnvio}`;
