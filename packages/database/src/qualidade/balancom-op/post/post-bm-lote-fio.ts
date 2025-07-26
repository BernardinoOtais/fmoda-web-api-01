//BmTcSchema
import { BmAlteraNomeLoteFio } from "@repo/tipos/qualidade_balancom";
import { z } from "zod";

import { prismaQualidade } from "@/prisma-servicos/qualidade/qualidade";

export const postBmLoteFioBd = async (
  value: z.infer<typeof BmAlteraNomeLoteFio>
) => {
  await prismaQualidade.bmMalhasFio.update({
    where: {
      idBm_ref_refOrigem: {
        idBm: value.idBm,
        ref: value.ref,
        refOrigem: value.refOrigem,
      },
    },
    data: { lote: value.texto },
  });
};
