import { getOpAbertasDb } from "@repo/db/planeamento";
import { PAPEL_ROTA_PLANEAMENTO } from "@repo/tipos/consts";
import { TRPCError } from "@trpc/server";

import { createTRPCRouter, roleProtectedProcedure } from "@/init";

const PAPEL_ROTA = PAPEL_ROTA_PLANEAMENTO;

export const planeamento = createTRPCRouter({
  getOpAbertas: roleProtectedProcedure(PAPEL_ROTA).query(async () => {
    try {
      return await getOpAbertasDb();
    } catch (err) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "Erro ao obter envio.",
        cause: err, // optional, for logging/debugging
      });
    }
  }),
});
