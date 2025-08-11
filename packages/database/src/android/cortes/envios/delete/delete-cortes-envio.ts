import { prismaAndroidCortes } from "@/prisma-servicos/android/cortes/android-cortes-client";

export const deleteCortesEnvio = async (nomeUser: string, idEnvio: number) =>
  prismaAndroidCortes.$queryRaw`exec apagaEnvio ${nomeUser}, ${idEnvio}`;
