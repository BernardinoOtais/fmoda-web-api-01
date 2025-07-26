import { PostComposicaoFinal } from "@repo/tipos/qualidade_balancom_composicao";
import { z } from "zod";

import { prismaQualidade } from "@/prisma-servicos/qualidade/qualidade";

export const postComposicaoFinalDb = async (
  value: z.infer<typeof PostComposicaoFinal>
) =>
  await prismaQualidade.bm.update({
    where: { idBm: value.idBm },
    data: { composicao: value.composicao },
  });
