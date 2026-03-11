import {
  getFornecedoresDb,
  getContaCorrentDb,
} from "@repo/db/joana/contacorrente";
import { PAPEL_JOANA } from "@repo/tipos/consts";
import { NoSchema } from "@repo/tipos/joana/contacorrente";
import { TRPCError } from "@trpc/server";

import { createTRPCRouter, roleProtectedProcedure } from "@/init";

const PAPEL_ROTA = PAPEL_JOANA;

export const joanaContaCorrente = createTRPCRouter({
  getFonecedores: roleProtectedProcedure(PAPEL_ROTA).query(async () => {
    try {
      return await getFornecedoresDb();
    } catch (err) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "Erro receber Fornecedores",
        cause: err, // optional, for logging/debugging
      });
    }
  }),
  getContaCorrente: roleProtectedProcedure(PAPEL_ROTA)
    .input(NoSchema)
    .query(async ({ input }) => {
      try {
        const no = input;
        return await getContaCorrentDb(no);
      } catch (err) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Erro receber dados",
          cause: err, // optional, for logging/debugging
        });
      }
    }),
});
