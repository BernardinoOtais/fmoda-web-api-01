// get este getEnviosAcessoriosDb

import { baseProcedure, createTRPCRouter } from "@/init";
import { DadosParaPesquisaComPaginacaoEOrdemSchema } from "@repo/tipos/comuns";

import { getEnviosAcessoriosDb } from "@repo/db/embarques";
import { TRPCError } from "@trpc/server";

export const embarques = createTRPCRouter({
  getEnviosAcessoriosDb: baseProcedure
    .input(DadosParaPesquisaComPaginacaoEOrdemSchema)
    .query(async ({ input }) => {
      try {
        return await getEnviosAcessoriosDb(input);
      } catch (err) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Erro ao obter envios de acessórios.",
          cause: err, // optional, for logging/debugging
        });
      }
    }),
});
