import { prismaAndroidMarrocos } from "@/prisma-servicos/android/marrocos/android-marrocos-client";

export const getDestinos = async () =>
  prismaAndroidMarrocos.$queryRaw`exec enviosMarrocosListaDestinos `;
