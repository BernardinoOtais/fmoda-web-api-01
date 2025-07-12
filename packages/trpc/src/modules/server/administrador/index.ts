import { getPapeisDb, postPapeisDb } from "@repo/db/administrador_user";
import { PAPEL_ROTA_ADMINISTRADOR } from "@repo/tipos/consts";
import { PostPapeisSchema } from "@repo/tipos/user";
import { TRPCError } from "@trpc/server";

import { createTRPCRouter, roleProtectedProcedure } from "@/init";

const PAPEL_ROTA = PAPEL_ROTA_ADMINISTRADOR;

export const administrador = createTRPCRouter({
  getPapeis: roleProtectedProcedure(PAPEL_ROTA).query(async () => {
    try {
      return await getPapeisDb();
    } catch (err) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "Erro ao obter envios de acessórios.",
        cause: err, // optional, for logging/debugging
      });
    }
  }),
  postPapeis: roleProtectedProcedure(PAPEL_ROTA)
    .input(PostPapeisSchema)
    .mutation(async ({ input }) => {
      try {
        await postPapeisDb(input.userId, input.papeis);
      } catch (err) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Erro ao inserrir papeis...",
          cause: err, // optional, for logging/debugging
        });
      }
    }),
});
