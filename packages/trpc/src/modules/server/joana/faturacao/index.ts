import { getFaturasDb } from "@repo/db/joana/faturas";
import { PAPEL_JOANA } from "@repo/tipos/consts";
import { PesquisaFaturasSchema } from "@repo/tipos/joana/faturas";
import { TRPCError } from "@trpc/server";

import { createTRPCRouter, roleProtectedProcedure } from "@/init";

const PAPEL_ROTA = PAPEL_JOANA;

export const joanaFaturacao = createTRPCRouter({
  getFaturacao: roleProtectedProcedure(PAPEL_ROTA)
    .input(PesquisaFaturasSchema)
    .query(async ({ input }) => {
      try {
        const { dataIni, dataFini, op } = input;
        return await getFaturasDb(dataIni, dataFini, op);
      } catch (err) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Erro receber Faturaçāo...",
          cause: err, // optional, for logging/debugging
        });
      }
    }),
});
