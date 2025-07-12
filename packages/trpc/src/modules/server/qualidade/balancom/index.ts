import { getBmSssBd } from "@repo/db/qualidade_balancom";
import { DadosParaPesquisaComPaginacaoEOrdemSchema } from "@repo/tipos/comuns";
import { PAPEL_ROTA_QUALIDADE } from "@repo/tipos/consts";
import { TRPCError } from "@trpc/server";

import { createTRPCRouter, roleProtectedProcedure } from "@/init";

const PAPEL_ROTA = PAPEL_ROTA_QUALIDADE;

export const qualidade_balancom: ReturnType<typeof createTRPCRouter> =
  createTRPCRouter({
    getBmSss: roleProtectedProcedure(PAPEL_ROTA)
      .input(DadosParaPesquisaComPaginacaoEOrdemSchema)
      .query(async ({ input }) => {
        try {
          return await getBmSssBd(input);
        } catch (error) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Erro ao obter Bms...",
            cause: error, // optional, for logging/debugging
          });
        }
      }),
  });
