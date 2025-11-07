import { getEstampadosBordadosDb } from "@repo/db/joana/esteborda";
import { PAPEL_JOANA } from "@repo/tipos/consts";
import { TRPCError } from "@trpc/server";

import { createTRPCRouter, roleProtectedProcedure } from "@/init";

const PAPEL_ROTA = PAPEL_JOANA;

export const joanaEstampadosEBordados = createTRPCRouter({
  getEstampadosEBordados: roleProtectedProcedure(PAPEL_ROTA).query(async () => {
    try {
      return await getEstampadosBordadosDb();
    } catch (err) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "Erro receber Estampados e Bordados",
        cause: err, // optional, for logging/debugging
      });
    }
  }),
});
