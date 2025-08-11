import { prismaAndroidCortes } from "@/prisma-servicos/android/cortes/android-cortes-client";

export const deleteCortesLote = async (idEnvio: number, codigoIcf: string) =>
  prismaAndroidCortes.$queryRaw`exec apagaLote ${idEnvio}, ${codigoIcf}`;
