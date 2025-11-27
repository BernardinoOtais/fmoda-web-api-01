import {
  getEstampadosBordadosDb,
  postEscondeMostraBordadosEstampadosBd,
} from "@repo/db/joana/esteborda";
import { PAPEL_JOANA } from "@repo/tipos/consts";
import { EscondeMostraSchema, OpSchema } from "@repo/tipos/joana/esteborda";
import { TRPCError } from "@trpc/server";

import { createTRPCRouter, roleProtectedProcedure } from "@/init";

const PAPEL_ROTA = PAPEL_JOANA;

export const joanaEstampadosEBordados = createTRPCRouter({
  getEstampadosEBordados: roleProtectedProcedure(PAPEL_ROTA)
    .input(OpSchema)
    .query(async ({ input }) => {
      try {
        const { op, veEscondidas } = input;
        return await getEstampadosBordadosDb(op, veEscondidas);
      } catch (err) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Erro receber Estampados e Bordados",
          cause: err, // optional, for logging/debugging
        });
      }
    }),
  patchPostInsertEscondeBordadosEstampados: roleProtectedProcedure(PAPEL_ROTA)
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
