import { getEstampadosBordadosDb } from "@repo/db/joana/esteborda";
import { PAPEL_JOANA } from "@repo/tipos/consts";
import { OpSchema } from "@repo/tipos/joana/esteborda";
import { TRPCError } from "@trpc/server";

import { createTRPCRouter, roleProtectedProcedure } from "@/init";

const PAPEL_ROTA = PAPEL_JOANA;

export const joanaEstampadosEBordados = createTRPCRouter({
  getEstampadosEBordados: roleProtectedProcedure(PAPEL_ROTA)
    .input(OpSchema)
    .query(async ({ input }) => {
      try {
        const { op } = input;
        return await getEstampadosBordadosDb(op);
      } catch (err) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Erro receber Estampados e Bordados",
          cause: err, // optional, for logging/debugging
        });
      }
    }),
});
