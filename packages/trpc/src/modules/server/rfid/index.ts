import { getRfidOpFornecedorDb } from "@repo/db/rfid";
import { PAPEL_RFID } from "@repo/tipos/consts";
import { PedidosSchema } from "@repo/tipos/rfid";
import { TRPCError } from "@trpc/server";

import { createTRPCRouter, roleProtectedProcedure } from "@/init";

export const rfid = createTRPCRouter({
  getOPRfid: roleProtectedProcedure(PAPEL_RFID)
    .input(PedidosSchema)
    .query(async ({ input }) => {
      try {
        return await getRfidOpFornecedorDb(input);
      } catch (err) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Erro receber Dados desta leitura",
          cause: err, // optional, for logging/debugging
        });
      }
    }),
});
