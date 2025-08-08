import { prismaAndroidMarrocos } from "@/prisma-servicos/android/marrocos/android-marrocos-client";

export const deletePalete = async (idEnvioMarrocos: number) =>
  prismaAndroidMarrocos.$queryRaw`exec enviosMarrocosApagaPaleteRetornaPaletesDoEnvio ${idEnvioMarrocos}`;
