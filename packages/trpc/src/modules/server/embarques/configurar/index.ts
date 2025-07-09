import { createTRPCRouter, roleProtectedProcedure } from "@/init";
import { getItensAcessoriosDb } from "@repo/db/embarques_configurar";
import { PAPEL_ROTA_EMBARQUES } from "@repo/tipos/consts";
import { TRPCError } from "@trpc/server";

const PAPEL_ROTA = PAPEL_ROTA_EMBARQUES;

export const embarques_configorar = createTRPCRouter({
  getDestinosDisponiveis: roleProtectedProcedure(PAPEL_ROTA).query(async () => {
    try {
      return await getItensAcessoriosDb();
    } catch (err) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "Erro ao obter acessórios...",
        cause: err, // optional, for logging/debugging
      });
    }
  }),
});
