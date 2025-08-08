import { prismaAndroidCortes } from "@/prisma-servicos/android/cortes/android-cortes-client";

export const postCortesEnvio = async (nomeUser: string) =>
  prismaAndroidCortes.$queryRaw`exec novoEnvio ${nomeUser}`;
