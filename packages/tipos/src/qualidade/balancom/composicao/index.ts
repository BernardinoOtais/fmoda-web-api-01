import z from "zod";

import { Numero } from "..";

import { FloatZeroSchema, NumeroInteiro } from "@/index";

export const BmCalculoComposicaoSchema = z.object({
  idBm: z.string(),
  composicao: z.string().max(250),
  fechado: z.boolean(),
  BmMalhas: z
    .array(
      z.object({
        idBm: z.string(),
        ref: z.string().length(18),
        qtdeEntrada: Numero,
        qtdeEntradaSeUnidade: Numero.optional(),
        defeitosStock: Numero,
        sobras: Numero,
        grupo: z.string().max(3),
        grupoDescricao: z.string().max(100),
        subGrupo: z.string().max(3),
        subGrupoDescricao: z.string().max(100),
        unidade: z.string().max(4),
        composicao: z.array(
          z.object({
            idComposicao: NumeroInteiro,
            composicao: z.string().max(150),
            composicaoAbreviatura: z.string().max(25),
            ordem: NumeroInteiro,
            qtt: Numero,
          })
        ),
        fio: z.array(
          z.object({
            idBm: z.string(),
            ref: z.string().length(18),
            refOriginal: z.string().length(18),
            qtdeEntrada: Numero,
            defeitosStock: Numero,
            sobras: Numero,
            grupo: z.string().max(3),
            grupoDescricao: z.string().max(100),
            subGrupo: z.string().max(3),
            subGrupoDescricao: z.string().max(100),
            unidade: z.string().max(4),
            composicao: z.array(
              z.object({
                idComposicao: NumeroInteiro,
                composicao: z.string().max(150),
                composicaoAbreviatura: z.string().max(25),
                ordem: NumeroInteiro,
                qtt: Numero,
              })
            ),
          })
        ),
      })
    )
    .optional(),
  BmMateriaisComposicao: z
    .array(
      z.object({
        idComposicao: NumeroInteiro,
        composicao: z.string().max(150),
        composicaoAbreviatura: z.string().max(25),
        ordem: NumeroInteiro,
      })
    )
    .optional(),
});

export const PostDeComposicaoFio = z.object({
  op: z.string(),
  idBm: z.string(),
  ref: z.string().length(18),
  refOrigem: z.string().length(18),
  idComposicao: NumeroInteiro,
  qtt: FloatZeroSchema,
});

export const PostDeComposicao = z.object({
  op: z.string(),
  idBm: z.string(),
  ref: z.string().length(18),
  idComposicao: NumeroInteiro,
  qtt: FloatZeroSchema,
});

export const ComposicaoResultanteDados = z.object({
  idBm: z.string(),
  ComposicoesTratadas: z
    .array(
      z.object({
        idComposicao: NumeroInteiro,
        composicao: z.string().max(150),
        composicaoAbreviatura: z.string().max(25),
        ordem: NumeroInteiro,
        qtt: z.string().max(3),
      })
    )
    .optional(),
});

export const PostComposicaoFinal = z.object({
  idBm: z.string(),
  op: z.string(),
  composicao: z.string().max(250),
});
