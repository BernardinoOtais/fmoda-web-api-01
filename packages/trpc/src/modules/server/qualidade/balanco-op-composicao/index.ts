import {
  getBmDadosParaCalculoComposicaoDb,
  postBmNovoOuAlteroComposicaoBd,
  postBmNovoOuAlteroComposicaoFioBd,
  postComposicaoFinalDb,
} from "@repo/db/qualidade_balancom_op_composicao";
import { PAPEL_ROTA_QUALIDADE } from "@repo/tipos/consts";
import { OPschema } from "@repo/tipos/qualidade_balancom";
import {
  PostComposicaoFinal,
  PostDeComposicao,
  PostDeComposicaoFio,
} from "@repo/tipos/qualidade_balancom_composicao";
import { TRPCError } from "@trpc/server";

import { createTRPCRouter, roleProtectedProcedure } from "@/init";

const PAPEL_ROTA = PAPEL_ROTA_QUALIDADE;

export const qualidade_balancom_op_composicao = createTRPCRouter({
  getBmDadosParaCalculoComposicao: roleProtectedProcedure(PAPEL_ROTA)
    .input(OPschema)
    .query(async ({ input }) => {
      try {
        return await getBmDadosParaCalculoComposicaoDb(input.op);
      } catch (err) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Erro ao obter envio de acessórios.",
          cause: err,
        });
      }
    }),
  postOuAlteroComposicaoDoFio: roleProtectedProcedure(PAPEL_ROTA)
    .input(PostDeComposicaoFio)
    .mutation(async ({ input }) => {
      try {
        return await postBmNovoOuAlteroComposicaoFioBd(input);
      } catch (err) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Erro ao inserir compoisiçāo do fio...",
          cause: err,
        });
      }
    }),
  postBmNovoOuAlteroComposicao: roleProtectedProcedure(PAPEL_ROTA)
    .input(PostDeComposicao)
    .mutation(async ({ input }) => {
      try {
        return await postBmNovoOuAlteroComposicaoBd(input);
      } catch (err) {
        console.log("Erro: ", err);
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Erro ao inserir compoisiçāo da Malha...",
          cause: err,
        });
      }
    }),
  postComposicaoFinal: roleProtectedProcedure(PAPEL_ROTA)
    .input(PostComposicaoFinal)
    .mutation(async ({ input }) => {
      try {
        return await postComposicaoFinalDb(input);
      } catch (err) {
        console.log("Erro: ", err);
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Erro ao inserir compoisiçāo da Final...",
          cause: err,
        });
      }
    }),
});

///postComposicaoFinalDb
