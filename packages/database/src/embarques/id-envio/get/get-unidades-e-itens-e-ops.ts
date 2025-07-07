import { prismaEnvios } from "@/prisma-servicos/envios/envios";

import {
  AutocompleteDto,
  IdNumeroInteiroNaoNegativoDto,
} from "@repo/tipos/comuns";
import { ContainerOpsSchemasDto } from "@repo/tipos/embarques_idenvio";

export const getUnidadesEItensEOpsDb = async ({
  id,
}: IdNumeroInteiroNaoNegativoDto): Promise<{
  unidades: AutocompleteDto[];
  itens: AutocompleteDto[];
  ops: AutocompleteDto[];
  containerOp: ContainerOpsSchemasDto;
}> => {
  const [unidades, itens, ops, containerOp] = await Promise.all([
    prismaEnvios.$queryRaw<AutocompleteDto[]>`
      SELECT
        a.idItem as value,
        a.descricaoUnidade as label
      FROM 
        Unidades a
      ORDER BY 
        a.descricaoUnidade
    `,
    prismaEnvios.$queryRaw<AutocompleteDto[]>`
      SELECT
        a.idItem as value,
        a.Descricao as label
      FROM 
        Item a
      JOIN 
        Acessorios b ON a.idItem = b.idItem 
      ORDER BY 
        a.Descricao
    `,
    prismaEnvios.$queryRaw<AutocompleteDto[]>`
      select 
        op as value,
        op as label
      from 
        ContainerOp
      where 
        idContainer = ${id}
    `,
    prismaEnvios.containerOp.findMany({
      where: { idContainer: id },
      select: {
        op: true,
        Op: {
          select: {
            op: true,
            ref: true,
            modeloDesc: true,
            modelo: true,
            cor: true,
            pedido: true,
            norma: true,
            OpTamanho: {
              select: {
                op: true,
                tam: true,
                ordem: true,
                qtt: true,
              },
            },
          },
        },
      },
    }),
  ]);

  return { unidades, itens, ops, containerOp };
};
