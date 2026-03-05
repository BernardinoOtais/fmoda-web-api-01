import {
  AutocompleteFornecedorStringSchema,
  AutocompleteStringDto,
} from "@repo/tipos/comuns";
import z from "zod";

import { prismaQualidade } from "@/prisma-servicos/qualidade/qualidade";

const dadosAreceber = z.array(AutocompleteFornecedorStringSchema);

export const getFornecedoresDb = async (): Promise<
  AutocompleteStringDto[] | null
> => {
  const dados = await prismaQualidade.$queryRaw<[]>`
    exec FMO_PHC..fm_web_get_fornecedores 
  `;

  ///console.log(dados);
  const valores = dadosAreceber.safeParse(dados);

  if (!valores.success) {
    console.log(valores.error);
    return null;
  }

  return valores.data;
};
