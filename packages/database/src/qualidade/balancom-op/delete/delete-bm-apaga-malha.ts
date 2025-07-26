import {
  DeleteApagaMalhaDto,
  DeleteApagaMalhaSchema,
} from "@repo/tipos/qualidade_balancom";

import { prismaQualidade } from "@/prisma-servicos/qualidade/qualidade";

export const deleteBmApagaMalhaBd = async (value: DeleteApagaMalhaDto) => {
  const { op, idBm, ref } = value;
  try {
    const resultadoDelete = await prismaQualidade.$transaction(async (db) => {
      const [malhaTotal, qtdeMalha] = await Promise.all([
        db.$queryRaw<{ soma: number }[]>`
          SELECT SUM(iif(unidade ='Un', iif(qtdeEntradaSeUnidade is null, 0,qtdeEntradaSeUnidade*qtdeEntrada), qtdeEntrada) - defeitosStock - sobras) AS soma
          FROM BmMalhas
          WHERE idBm = ${idBm}
        `,
        db.$queryRaw<{ soma: number }[]>`
          SELECT SUM(iif(unidade ='Un', iif(qtdeEntradaSeUnidade is null, 0,qtdeEntradaSeUnidade*qtdeEntrada), qtdeEntrada) - defeitosStock - sobras) AS soma
          FROM BmMalhas
          WHERE idBm = ${idBm} AND ref = ${ref}
        `,
      ]);

      if (!malhaTotal.length || !malhaTotal[0] || malhaTotal[0].soma === null) {
        console.error("No malha total found or sum is null for idBm:", idBm);
        return null;
      }

      const malhaTotalUtilizada = malhaTotal[0].soma;

      if (!qtdeMalha.length || !qtdeMalha[0] || qtdeMalha[0].soma === null) {
        console.error(
          "No qtde malha found or sum is null for idBm and op:",
          idBm,
          op
        );
        return null;
      }

      const qtdeDestaMalha = qtdeMalha[0].soma;

      if (
        qtdeDestaMalha === 0 ||
        malhaTotalUtilizada === 0 ||
        qtdeDestaMalha / malhaTotalUtilizada > 0.8
      ) {
        console.error("Nao respeita os 8%", idBm, op);
        return null;
      }

      await db.bmMovimentosLotes.deleteMany({
        where: { idBm, ref },
      });

      await db.bmOpsPorMalha.deleteMany({
        where: { idBm, ref },
      });

      await db.bmIdBmComposicao.deleteMany({
        where: { idBm, ref },
      });

      const result = await db.bmMalhas.delete({
        where: { idBm_ref: { idBm, ref } },
      });

      return result;
    });

    if (!resultadoDelete) return null;

    return DeleteApagaMalhaSchema.parse({
      idBm: resultadoDelete.idBm,
      ref: resultadoDelete.ref,
      op: op,
    });
  } catch (error) {
    console.error("error deleteBmApagaMalha", error);
    return null;
  }
};
