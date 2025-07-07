import { prismaEnvios } from "@/prisma-servicos/envios/envios";

import { IdNumeroInteiroNaoNegativoDto } from "@repo/tipos/comuns";
import { ListaContudoDto } from "@repo/tipos/embarques_idenvio";

export const getConteudoDb = async ({
  id,
}: IdNumeroInteiroNaoNegativoDto): Promise<ListaContudoDto> =>
  prismaEnvios.conteudo.findMany({
    where: {
      idContainer: id,
    },
    select: {
      idConteudo: true,
      idContainer: true,
      idItem: true,
      Item: {
        select: {
          idItem: true,
          Descricao: true,
          ItemTraduzido: {
            select: {
              descItem: true,
            },
            where: {
              idIdioma: 2,
            },
          },
        },
      },
      Op: {
        select: {
          op: true,
          ref: true,
          modeloDesc: true,
          modelo: true,
          cor: true,
          pedido: true,
          norma: true,
        },
      },
      op: true,
      tam: true,
      OpTamanho: {
        select: { ordem: true },
      },
      qtt: true,
      Unidades: {
        select: {
          idUnidades: true,
          idItem: true,
          descricaoUnidade: true,
          Item: {
            select: {
              ItemTraduzido: {
                select: {
                  descItem: true,
                },
                where: {
                  idIdioma: 2,
                },
              },
            },
          },
        },
      },
      peso: true,
    },
    orderBy: [
      { op: "asc" },
      { idItem: "asc" },
      {
        OpTamanho: {
          ordem: "asc",
        },
      },
    ],
  });
