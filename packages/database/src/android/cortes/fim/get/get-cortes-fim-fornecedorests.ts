import { prismaAndroidCortes } from "@/prisma-servicos/android/cortes/android-cortes-client";

export const getCortesFimFornecedores = async (
  opLotes: number,
  faseProducao: string,
  sectorProd: string,
  naOP: boolean,
  parteRec?: string
) =>
  prismaAndroidCortes.$queryRaw`exec listaRecursos ${opLotes}, ${faseProducao}, ${sectorProd}, ${naOP}, ${parteRec || ""}`;
