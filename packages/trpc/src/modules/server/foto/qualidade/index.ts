import { fotoModelo } from "@repo/imagens";
import { FotoPropSchema } from "@repo/tipos/comuns";
import { PAPEL_ROTA_QUALIDADE } from "@repo/tipos/consts";
import { TRPCError } from "@trpc/server";

import { createTRPCRouter, roleProtectedProcedure } from "@/init";

const PAPEL_ROTA = PAPEL_ROTA_QUALIDADE;
export const qualidade_foto = createTRPCRouter({
  getFoto: roleProtectedProcedure(PAPEL_ROTA)
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
