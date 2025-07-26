import {
  PostBmIdBmOpnFaturaCmrObsDto,
  PostBmIdBmOpnFaturaCmrObsSchema,
} from "@repo/tipos/qualidade_balancom";

import { prismaQualidade } from "@/prisma-servicos/qualidade/qualidade";

export const postBmIdBmOpnFaturaCmrObsBd = async (
  value: PostBmIdBmOpnFaturaCmrObsDto
) => {
  const { idBm, op, nFatutura, chave, valor } = value;

  const resultado = await prismaQualidade.bmOpFaturado.update({
    where: {
      idBm_op_nFatutura: {
        idBm,
        op,
        nFatutura,
      },
    },
    data: {
      [chave]: valor,
    },
  });

  const valorAtualizado = resultado[chave as "cmr" | "obs"];

  return PostBmIdBmOpnFaturaCmrObsSchema.parse({
    idBm,
    op,
    nFatutura,
    chave,
    valor: valorAtualizado,
  });
};
