import {
  dadosPartesAndroid,
  deleteItemDb,
  devolveEstadoDoItem,
  escrevoDadoPartesAndroid,
  getItensAcessoriosDb,
  insiroItensDB,
  patchEstadoItemDb,
  patchNomeItemDb,
  verificoSeOItemJaFoiUsadoDb,
} from "@repo/db/embarques_configurar";
import { IdNumeroInteiroNaoNegativoSchema } from "@repo/tipos/comuns";
import { PAPEL_ROTA_EMBARQUES } from "@repo/tipos/consts";
import {
  PatchItemSchema,
  PostItensAcessoriosSchema,
} from "@repo/tipos/embarques_configurar";
import { TRPCError } from "@trpc/server";

import { createTRPCRouter, roleProtectedProcedure } from "@/init";

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
  patchEstadoItem: roleProtectedProcedure(PAPEL_ROTA)
    .input(IdNumeroInteiroNaoNegativoSchema)
    .mutation(async ({ input }) => {
      try {
        const idItem = input.id;
        const estado = await devolveEstadoDoItem(idItem);
        if (!estado)
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Não exite esse item...",
          });
        return patchEstadoItemDb(idItem, !estado.inativo);
      } catch (err) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Erro ao alterrar estado item...",
          cause: err, // optional, for logging/debugging
        });
      }
    }),
  apagaItem: roleProtectedProcedure(PAPEL_ROTA)
    .input(IdNumeroInteiroNaoNegativoSchema)
    .mutation(async ({ input }) => {
      try {
        const idItem = input.id;
        const verificoSeOItemJaFoiUsado =
          await verificoSeOItemJaFoiUsadoDb(idItem);
        if (verificoSeOItemJaFoiUsado)
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Não pode apagar, item já usado...",
          });
        await deleteItemDb(idItem);
      } catch (err) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Erro ao apagar item...",
          cause: err, // optional, for logging/debugging
        });
      }
    }),
  patchNomeItem: roleProtectedProcedure(PAPEL_ROTA)
    .input(PatchItemSchema)
    .mutation(async ({ input }) => {
      try {
        const idItem = input.idItem;
        const verificoSeOItemJaFoiUsado =
          await verificoSeOItemJaFoiUsadoDb(idItem);
        if (verificoSeOItemJaFoiUsado)
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Não pode alterar, item já usado...",
          });
        await patchNomeItemDb(input);
      } catch (err) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Erro ao apagar item...",
          cause: err, // optional, for logging/debugging
        });
      }
    }),
  insiroItens: roleProtectedProcedure(PAPEL_ROTA)
    .input(PostItensAcessoriosSchema)
    .mutation(async ({ input }) => {
      try {
        await insiroItensDB(input);
      } catch (err) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Erro ao inserir items...",
          cause: err, // optional, for logging/debugging
        });
      }
    }),
  updateAndroidData: roleProtectedProcedure(PAPEL_ROTA).mutation(async () => {
    try {
      const dadosPartesAndroidDb = await dadosPartesAndroid();

      if (dadosPartesAndroidDb.length === 0)
        return {
          status: "nothing-to-update",
          message: "Nada para actualizar",
        };
      await escrevoDadoPartesAndroid(dadosPartesAndroidDb);
      return {
        status: "success",
        message: "Dados Android atualizados com sucesso",
      };
    } catch (err) {
      console.log("cenas e coisas : ", err);
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: err instanceof Error ? err.message : String(err),
        cause: err, // optional, for logging/debugging
      });
    }
  }),
});
