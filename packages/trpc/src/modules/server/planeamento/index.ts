import { getOpAbertasDb, getFornecedoresBd } from "@repo/db/planeamento";
import { saveBase64Image } from "@repo/imagens";
import { PAPEL_ROTA_PLANEAMENTO } from "@repo/tipos/consts";
import { uploadPhotoSchema } from "@repo/tipos/foto";
import { TRPCError } from "@trpc/server";

import { createTRPCRouter, roleProtectedProcedure } from "@/init";

const PAPEL_ROTA = PAPEL_ROTA_PLANEAMENTO;

export const planeamento = createTRPCRouter({
  getOpsEClientes: roleProtectedProcedure(PAPEL_ROTA).query(async () => {
    try {
      const getFornecedores = await getFornecedoresBd();
      const getOpAbertas = await getOpAbertasDb();
      return { fornecedores: getFornecedores, ops: getOpAbertas };
    } catch (err) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "Erro ao obter envio.",
        cause: err, // optional, for logging/debugging
      });
    }
  }),
  patchEstadoItem: roleProtectedProcedure(PAPEL_ROTA)
    .input(uploadPhotoSchema)
    .mutation(async ({ input }) => {
      try {
        const { base64, filename } = input;
        return saveBase64Image(base64, filename);
      } catch (err) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Erro ao inserir foto...",
          cause: err, // optional, for logging/debugging
        });
      }
    }),
});
