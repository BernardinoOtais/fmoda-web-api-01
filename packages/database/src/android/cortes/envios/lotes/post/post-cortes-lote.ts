import { prismaAndroidCortes } from "@/prisma-servicos/android/cortes/android-cortes-client";

export const postCortesLote = async (
  nomeUser: string,
  codigoIcf: string,
  idEnvio: number,
  qtdeAlterada: number,
  nLote: number
) =>
  prismaAndroidCortes.$queryRaw`exec novoLote ${nomeUser}, ${codigoIcf}, ${idEnvio}, ${qtdeAlterada}, ${nLote}`;
