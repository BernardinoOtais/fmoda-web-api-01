import { PostDeComposicaoFio } from "@repo/tipos/qualidade_balancom_composicao";
import { z } from "zod";

import { prismaQualidade } from "@/prisma-servicos/qualidade/qualidade";

export async function postBmNovoOuAlteroComposicaoFioBd(
  value: z.infer<typeof PostDeComposicaoFio>
) {
  const { idBm, ref, refOrigem, idComposicao, qtt } = value;

  const result = prismaQualidade.bmFioComposicao.upsert({
    where: {
      idBm_ref_refOrigem_idComposicao: { idBm, ref, refOrigem, idComposicao },
    },
    update: { qtt },
    create: {
      idBm,
      ref,
      refOrigem,
      idComposicao,
      qtt,
    },
  });
  return PostDeComposicaoFio.parse(result);
}
