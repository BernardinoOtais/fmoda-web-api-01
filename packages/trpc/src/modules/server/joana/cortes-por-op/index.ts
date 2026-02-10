import {
  getCortesPorOpDb,
  postEscondeMostraBordadosEstampadosBd,
} from "@repo/db/joana/corteporop";
import { PAPEL_JOANA } from "@repo/tipos/consts";
import { OpSchema, EscondeMostraSchema } from "@repo/tipos/joana/corteporop";
import { TRPCError } from "@trpc/server";

import { createTRPCRouter, roleProtectedProcedure } from "@/init";

const PAPEL_ROTA = PAPEL_JOANA;

export const joanaCortesPorOp = createTRPCRouter({
  getCortesPorOp: roleProtectedProcedure(PAPEL_ROTA)
    .input(OpSchema)
    .query(async ({ input }) => {
      try {
        const { op, veEscondidas } = input;
        return await getCortesPorOpDb(op, veEscondidas);
      } catch (err) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Erro receber Cortes",
          cause: err, // optional, for logging/debugging
        });
      }
    }),
  patchPostInsertEscondeCortados: roleProtectedProcedure(PAPEL_ROTA)
    .input(EscondeMostraSchema)
    .mutation(async ({ ctx, input }) => {
      try {
        const userName = ctx.auth.user.name;
        const { bostamp } = input;
        return postEscondeMostraBordadosEstampadosBd(bostamp, userName);
      } catch (err) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Erro ao esconder mostrar estampados e bordados...",
          cause: err, // optional, for logging/debugging
        });
      }
    }),
});
