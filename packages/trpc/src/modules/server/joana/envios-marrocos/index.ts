import { getEnviosMarrocosDb } from "@repo/db/joana/enviosmarrocos";
import { PAPEL_JOANA } from "@repo/tipos/consts";
import { PesquisaEnviosMarrocosSchema } from "@repo/tipos/joana/enviosmarrocos";
import { TRPCError } from "@trpc/server";

import { createTRPCRouter, roleProtectedProcedure } from "@/init";

const PAPEL_ROTA = PAPEL_JOANA;

export const joanaEnviosAMarrocos = createTRPCRouter({
  getEnviosMarrocos: roleProtectedProcedure(PAPEL_ROTA)
    .input(PesquisaEnviosMarrocosSchema)
    .query(async ({ input }) => {
      try {
        const { dataIni, dataFini, op } = input;
        return await getEnviosMarrocosDb(dataIni, dataFini, op);
      } catch (err) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Erro receber Envio a Marrocos...",
          cause: err, // optional, for logging/debugging
        });
      }
    }),
});
