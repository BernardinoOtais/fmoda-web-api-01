import { getOpsDb } from "@repo/db/joana/ops";
import { PAPEL_JOANA } from "@repo/tipos/consts";
import { PesquisaOpsSchema } from "@repo/tipos/joana/ops";
import { TRPCError } from "@trpc/server";

import { createTRPCRouter, roleProtectedProcedure } from "@/init";

const PAPEL_ROTA = PAPEL_JOANA;

export const JoanagetOps = createTRPCRouter({
  getOps: roleProtectedProcedure(PAPEL_ROTA)
    .input(PesquisaOpsSchema)
    .query(async ({ input }) => {
      try {
        const { op, modelo, pedido } = input;
        return await getOpsDb(op, modelo, pedido);
      } catch (err) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Erro receber ops",
          cause: err, // optional, for logging/debugging
        });
      }
    }),
});
