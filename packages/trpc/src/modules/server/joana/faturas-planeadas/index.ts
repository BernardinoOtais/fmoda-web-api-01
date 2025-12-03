import { getFaturasPlaneadasDb } from "@repo/db/joana/faturasplan";
import { PAPEL_JOANA } from "@repo/tipos/consts";
import { PesquisaFaturasPlaneadasSchema } from "@repo/tipos/joana/faturasplan";
import { TRPCError } from "@trpc/server";

import { createTRPCRouter, roleProtectedProcedure } from "@/init";

const PAPEL_ROTA = PAPEL_JOANA;

export const joanaFaturacaoPlaneada = createTRPCRouter({
  getFaturacaoPlaneada: roleProtectedProcedure(PAPEL_ROTA)
    .input(PesquisaFaturasPlaneadasSchema)
    .query(async ({ input }) => {
      try {
        const { dataIni, dataFini, fornecedor } = input;
        return await getFaturasPlaneadasDb(dataIni, dataFini, fornecedor);
      } catch (err) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Erro receber Faturaçāo planeada...",
          cause: err, // optional, for logging/debugging
        });
      }
    }),
});
