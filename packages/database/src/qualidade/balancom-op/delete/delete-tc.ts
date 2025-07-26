import { BmTcDto } from "@repo/tipos/qualidade_balancom";

import { prismaQualidade } from "@/prisma-servicos/qualidade/qualidade";

export const deleteTcBd = async (value: BmTcDto) =>
  prismaQualidade.bmTc.delete({
    where: { idBm_nomeTc: { idBm: value.idBm, nomeTc: value.nomeTc } },
  });
