import { BmCalculoComposicaoSchema } from "@repo/tipos/qualidade_balancom_composicao";

import { Decimal } from "@/generated/prisma/qualidade/runtime/library";
import { prismaQualidade } from "@/prisma-servicos/qualidade/qualidade";

export const getBmDadosParaCalculoComposicaoDb = async (op: number) => {
  const dados = await prismaQualidade.bmOp.findFirst({
    where: { op },
  });

  if (!dados) return null;

  const idBm = dados.idBm;

  const dadosFinais = await prismaQualidade.bm.findUnique({
    where: { idBm },
    include: {
      BmMalhas: {
        select: {
          ref: true,
          qtdeEntrada: true,
          defeitosStock: true,
          sobras: true,
          grupo: true,
          subGrupo: true,
          qtdeEntradaSeUnidade: true,
          unidade: true,
          BmMateriais: {
            select: {
              BmMaterialGrupo: { select: { grupoDescricao: true } },
              BmMaterialSubGrupo: { select: { subGrupoDescricao: true } },
            },
          },
          BmMalhasFio: {
            select: {
              ref: true,
              refOrigem: true,
              qtdeEntrada: true,
              defeitosStock: true,
              sobras: true,
              grupo: true,
              subGrupo: true,
              unidade: true,
              BmMateriaisFio: {
                select: {
                  BmMaterialGrupoFio: { select: { grupoDescricao: true } },
                  BmMaterialSubGrupoFio: {
                    select: { subGrupoDescricao: true },
                  },
                },
              },
            },
          },
        },

        orderBy: { qtdeEntrada: "desc" },
      },
    },
  });

  const composicao = await prismaQualidade.bmMateriaisComposicao.findMany({
    where: { inactivo: false },
    select: {
      idComposicao: true,
      composicao: true,
      composicaoAbreviatura: true,
      ordem: true,
    },
    orderBy: { ordem: "asc" },
  });

  const composicaoExistente = await prismaQualidade.bmIdBmComposicao.findMany({
    where: { idBm },
  });

  const composicaoExistenteFio = await prismaQualidade.bmFioComposicao.findMany(
    {
      where: { idBm },
    }
  );

  if (!dadosFinais) return null;

  if (!composicao) return null;

  const malhas = dadosFinais.BmMalhas.map((map) => {
    return {
      idBm: dadosFinais.idBm,
      ref: map.ref,
      qtdeEntrada: map.qtdeEntrada,
      qtdeEntradaSeUnidade: map.qtdeEntradaSeUnidade,
      defeitosStock: map.defeitosStock,
      sobras: map.sobras,
      grupo: map.grupo,
      grupoDescricao: map.BmMateriais.BmMaterialGrupo.grupoDescricao,
      subGrupo: map.subGrupo,
      subGrupoDescricao: map.BmMateriais.BmMaterialSubGrupo.subGrupoDescricao,
      unidade: map.unidade,
      composicao: composicao.map((co) => {
        return {
          idComposicao: co.idComposicao,
          composicao: co.composicao,
          composicaoAbreviatura: co.composicaoAbreviatura,
          ordem: co.ordem,
          qtt: quantidade(map.ref, co.idComposicao, composicaoExistente),
        };
      }),
      fio: map.BmMalhasFio.map((fio) => {
        return {
          idBm: dadosFinais.idBm,
          ref: fio.ref,
          refOriginal: fio.refOrigem,
          qtdeEntrada: fio.qtdeEntrada,
          defeitosStock: fio.defeitosStock,
          sobras: fio.sobras,
          grupo: fio.grupo,
          grupoDescricao: fio.BmMateriaisFio.BmMaterialGrupoFio.grupoDescricao,
          subGrupo: fio.subGrupo,
          subGrupoDescricao:
            fio.BmMateriaisFio.BmMaterialSubGrupoFio.subGrupoDescricao,
          unidade: fio.unidade,
          composicao: composicao.map((coFio) => {
            return {
              idComposicao: coFio.idComposicao,
              composicao: coFio.composicao,
              composicaoAbreviatura: coFio.composicaoAbreviatura,
              ordem: coFio.ordem,
              qtt: quantidade(
                fio.refOrigem,
                coFio.idComposicao,
                composicaoExistenteFio
              ),
            };
          }),
        };
      }),
    };
  });

  return BmCalculoComposicaoSchema.parse({
    idBm: dadosFinais.idBm,
    fechado: dadosFinais.fechado,
    composicao: dadosFinais.composicao,
    BmMalhas: malhas,
    BmMateriaisComposicao: composicao,
  });
};

const quantidade = (
  ref: string,
  idComposicao: number,
  dados: {
    idBm: string;
    ref: string;
    refOrigem?: string;
    idComposicao: number;
    qtt: Decimal;
  }[]
) => {
  const indice = dados.findIndex(
    (o) => o.idComposicao === idComposicao && (o.refOrigem || o.ref) === ref
  );

  const item = dados[indice];
  return item?.qtt ?? 0;
};
