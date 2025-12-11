import { getEntradasMcMaDb } from "@repo/db/joana/emmcma";
import { PAPEL_JOANA } from "@repo/tipos/consts";
import { OpSchema } from "@repo/tipos/joana/emmcma";
import { TRPCError } from "@trpc/server";

import { createTRPCRouter, roleProtectedProcedure } from "@/init";

const PAPEL_ROTA = PAPEL_JOANA;

export const joanaEntradasMcMa = createTRPCRouter({
  getEntradasMcMa: roleProtectedProcedure(PAPEL_ROTA)
    .input(OpSchema)
    .query(async ({ input }) => {
      try {
        const { op } = input;
        return await getEntradasMcMaDb(op);
      } catch (err) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Erro receber Movimentos da Malha",
          cause: err, // optional, for logging/debugging
        });
      }
    }),
});
