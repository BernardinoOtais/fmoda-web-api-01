import { fotoModelo } from "@repo/imagens";
import { FotoPropSchema } from "@repo/tipos/comuns";
import { TRPCError } from "@trpc/server";

import { createTRPCRouter, roleProtectedProcedureQualquerUser } from "@/init";

export const fotosGeraisFmoda = createTRPCRouter({
  getFoto: roleProtectedProcedureQualquerUser()
    .input(FotoPropSchema)
    .query(async ({ input }) => {
      const foto = await fotoModelo(input.id);

      if (!foto) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Foto não encontrada ou inválida",
        });
      }

      return foto;
    }),
});
