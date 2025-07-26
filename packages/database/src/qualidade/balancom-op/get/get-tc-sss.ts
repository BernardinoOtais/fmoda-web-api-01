import { NewIdSqlDto } from "@repo/tipos/comuns";

import { prismaQualidade } from "@/prisma-servicos/qualidade/qualidade";

export const getTcsssBd = async (idBm: NewIdSqlDto) =>
  prismaQualidade.bmTc.findMany({ where: { idBm } });
