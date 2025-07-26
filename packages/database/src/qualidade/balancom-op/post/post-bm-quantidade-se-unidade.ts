import { PostDeQuantidadeSeUnidade } from "@repo/tipos/qualidade_balancom";
import { z } from "zod";

import { prismaQualidade } from "@/prisma-servicos/qualidade/qualidade";

export const postBmQuantidadeSeUnidadeBd = async (
  value: z.infer<typeof PostDeQuantidadeSeUnidade>
) => {
  await prismaQualidade.bmMalhas.update({
    where: {
      idBm_ref: { idBm: value.idBm, ref: value.ref },
    },
    data: { qtdeEntradaSeUnidade: value.qtdeEntradaSeUnidade },
  });
};
