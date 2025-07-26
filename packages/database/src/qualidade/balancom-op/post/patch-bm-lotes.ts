import { PostDeLotesDto } from "@repo/tipos/qualidade_balancom";

import { prismaQualidade } from "@/prisma-servicos/qualidade/qualidade";

export const patchBmLotesBd = async (dados: PostDeLotesDto) => {
  const resultado = await prismaQualidade.bmMalhas.update({
    where: {
      idBm_ref: { idBm: dados.idBm, ref: dados.ref },
    },
    data: { lote: dados.lote },
  });

  return {
    idBm: resultado.idBm,
    ref: resultado.ref,
    lote: resultado.lote,
  };
};
