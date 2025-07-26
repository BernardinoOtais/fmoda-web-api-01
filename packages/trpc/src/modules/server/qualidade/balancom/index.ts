import {
  getBmSssBd,
  getPrimeiroBmPorOpDb,
  postAbroOuFechoBmBd,
  postNovoBalancoMassasBd,
} from "@repo/db/qualidade_balancom";
import { DadosParaPesquisaComPaginacaoEOrdemSchema } from "@repo/tipos/comuns";
import { PAPEL_ROTA_QUALIDADE } from "@repo/tipos/consts";
import {
  IdBmBooleanAbreOuFecha,
  OPschema,
} from "@repo/tipos/qualidade_balancom";
import { TRPCError } from "@trpc/server";

import { createTRPCRouter, roleProtectedProcedure } from "@/init";

const PAPEL_ROTA = PAPEL_ROTA_QUALIDADE;

export const qualidade_balancom = createTRPCRouter({
  getBms: roleProtectedProcedure(PAPEL_ROTA)
    .input(DadosParaPesquisaComPaginacaoEOrdemSchema)
    .query(async ({ input }) => {
      try {
        return await getBmSssBd(input);
      } catch (err) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Erro ao obter envio de acessórios.",
          cause: err,
        });
      }
    }),
  getPrimeiroBmPorOp: roleProtectedProcedure(PAPEL_ROTA)
    .input(OPschema)
    .query(async ({ input }) => {
      try {
        return await getPrimeiroBmPorOpDb(input);
      } catch (err) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Erro get op para Bm...",
          cause: err,
        });
      }
    }),
  postNovoBalancoMassas: roleProtectedProcedure(PAPEL_ROTA)
    .input(OPschema)
    .mutation(async ({ input }) => {
      try {
        return await postNovoBalancoMassasBd(input);
      } catch (err) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Erro ao inserir op...",
          cause: err,
        });
      }
    }),
  postAbroOuFechoBm: roleProtectedProcedure(PAPEL_ROTA)
    .input(IdBmBooleanAbreOuFecha)
    .mutation(async ({ input }) => {
      try {
        return await postAbroOuFechoBmBd(input);
      } catch (err) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Erro ao abrir ou fechar...",
          cause: err,
        });
      }
    }),
});
//postAbroOuFechoBmBd
