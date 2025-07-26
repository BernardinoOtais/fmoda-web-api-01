import { PostBmIdBmOpnFaturaPesoLisquidoPesoBrutoDto } from "@repo/tipos/qualidade_balancom";

import { prismaQualidade } from "@/prisma-servicos/qualidade/qualidade";

export const postBmIdBmOpnFaturaPesoLisquidoPesoBrutoBd = async (
  value: PostBmIdBmOpnFaturaPesoLisquidoPesoBrutoDto
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

  const valorAtualizado = resultado[chave as "pesoBruto" | "pesoLiquido"];

  return {
    idBm,
    op,
    nFatutura,
    chave,
    valor: valorAtualizado?.toNumber?.(),
  };
};
