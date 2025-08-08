import { prismaAndroidMarrocos } from "@/prisma-servicos/android/marrocos/android-marrocos-client";

export const postPesos = async (listaPedidosEPesos: string) =>
  prismaAndroidMarrocos.$queryRaw`exec enviosMarrocosGravaPedidosEPesos ${listaPedidosEPesos}`;
