import {
  ContaCorrenteTodosFornecedoresDto,
  ContaCorrenteTodosFornecedoresSchema,
} from "@repo/tipos/joana/contacorrente";

import { prismaQualidade } from "@/prisma-servicos/qualidade/qualidade";

export const getContasCorrentesDb =
  async (): Promise<ContaCorrenteTodosFornecedoresDto | null> => {
    const dados = await prismaQualidade.$queryRaw<[]>`
    exec FMO_PHC..fm_web_get_conta_corrente_todos_fornecedores
  `;

    //console.log(dados);
    const valores = ContaCorrenteTodosFornecedoresSchema.safeParse(dados);

    if (!valores.success) {
      console.log(valores.error);
      return null;
    }

    return valores.data;
  };
