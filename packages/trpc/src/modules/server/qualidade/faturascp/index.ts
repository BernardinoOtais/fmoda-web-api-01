import {
  getBFaturasPbPlBd,
  patchFaturasComposicaoOpBd,
  patchFaturasPesoBd,
} from "@repo/db/qualidade/faturascp";
import { PAPEL_ROTA_QUALIDADE } from "@repo/tipos/consts";
import {
  FaturaGetSchema,
  PostComposicaoSchema,
  PostPesoBrutoEPesoLiquido,
} from "@repo/tipos/qualidade/faturascp";
import { TRPCError } from "@trpc/server";

import { createTRPCRouter, roleProtectedProcedure } from "@/init";

const PAPEL_ROTA = PAPEL_ROTA_QUALIDADE;

export const faturasComnposicaoPbEPl = createTRPCRouter({
  getBmDadosParaCalculoComposicao: roleProtectedProcedure(PAPEL_ROTA)
    .input(FaturaGetSchema)
    .query(async ({ input }) => {
      try {
        const { ano, fatura } = input;
        console.log("Dados: ", ano, fatura);
        return await getBFaturasPbPlBd(ano, fatura);
      } catch (err) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Erro ao obter pesos e composição das faturas.",
          cause: err,
        });
      }
    }),

  patchFaturasPeso: roleProtectedProcedure(PAPEL_ROTA)
    .input(PostPesoBrutoEPesoLiquido)
    .mutation(async ({ ctx, input }) => {
      try {
        const userName = ctx.auth.user.name;
        const { ftstamp, u_pnet, u_pbruto } = input;
        return await patchFaturasPesoBd(ftstamp, u_pnet, u_pbruto, userName);
      } catch (err) {
        console.log("Erro: ", err);
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Erro ao inserir pessos na fatura...",
          cause: err,
        });
      }
    }),
  patchFaturasComposicaoOp: roleProtectedProcedure(PAPEL_ROTA)
    .input(PostComposicaoSchema)
    .mutation(async ({ ctx, input }) => {
      try {
        const userName = ctx.auth.user.name;
        const { opStamp, composicao } = input;
        return await patchFaturasComposicaoOpBd(opStamp, composicao, userName);
      } catch (err) {
        console.log("Erro: ", err);
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Erro ao inserir composiçāo na fatura...",
          cause: err,
        });
      }
    }),
});

///postComposicaoFinalDb
