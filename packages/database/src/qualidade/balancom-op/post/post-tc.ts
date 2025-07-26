import { BmTcDto } from "@repo/tipos/qualidade_balancom";

import { prismaQualidade } from "@/prisma-servicos/qualidade/qualidade";

export const postTcNovoBd = async (value: BmTcDto) =>
  prismaQualidade.bmTc.upsert({
    where: { idBm_nomeTc: { idBm: value.idBm, nomeTc: value.nomeTc } },
    update: { nomeTc: value.nomeTc },
    create: { idBm: value.idBm, nomeTc: value.nomeTc },
  });
