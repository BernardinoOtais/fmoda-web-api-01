import { OpsSchema, OpsDto } from "@repo/tipos/joana/ops";
import z from "zod";

import { prismaQualidade } from "@/prisma-servicos/qualidade/qualidade";

export const getFornecedoresDb = async (
  op: number | null,
  modelo: string | null,
  pedido: string | null,
): Promise<OpsDto | null> => {
  const dados = await prismaQualidade.$queryRaw<[]>`
    exec FMO_PHC..fm_web_get_op_pedido_faturado ${op}. ${modelo}, ${pedido}
  `;

  ///console.log(dados);
  const valores = OpsSchema.safeParse(dados);

  if (!valores.success) {
    console.log(valores.error);
    return null;
  }

  return valores.data;
};
