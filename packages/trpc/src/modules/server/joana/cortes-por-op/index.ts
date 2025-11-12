import { getCortesPorOpDb } from "@repo/db/joana/corteporop";
import { PAPEL_JOANA } from "@repo/tipos/consts";
import { OpSchema } from "@repo/tipos/joana/corteporop";
import { TRPCError } from "@trpc/server";

import { createTRPCRouter, roleProtectedProcedure } from "@/init";

const PAPEL_ROTA = PAPEL_JOANA;

export const joanaCortesPorOp = createTRPCRouter({
  getCortesPorOp: roleProtectedProcedure(PAPEL_ROTA)
    .input(OpSchema)
    .query(async ({ input }) => {
      try {
        const { op } = input;
        return await getCortesPorOpDb(op);
      } catch (err) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Erro receber Cortes",
          cause: err, // optional, for logging/debugging
        });
      }
    }),
});
