import { PostDeDefeitosFio } from "@repo/tipos/qualidade_balancom";
import z from "zod";

import { prismaQualidade } from "@/prisma-servicos/qualidade/qualidade";

export const postBmDefeitoFioDb = async (
  value: z.infer<typeof PostDeDefeitosFio>
) => {
  await prismaQualidade.bmMalhasFio.update({
    where: {
      idBm_ref_refOrigem: {
        idBm: value.idBm,
        ref: value.ref,
        refOrigem: value.refOrigem,
      },
    },
    data: { defeitosStock: value.defeitosStock },
  });
  return "ok";
};
