import { prismaQualidade } from "@/prisma-servicos/qualidade/qualidade";

export const getNumeroBms = (fechado: boolean): Promise<number> =>
  prismaQualidade.bm.count({
    where: { fechado },
  });
