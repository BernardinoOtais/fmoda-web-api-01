import { prismaAndroidCortes } from "@/prisma-servicos/android/cortes/android-cortes-client";

export const getCortesFimRecursos = async (opLotes: number) =>
  prismaAndroidCortes.$queryRaw`exec listaFasePorOp ${opLotes}`;
