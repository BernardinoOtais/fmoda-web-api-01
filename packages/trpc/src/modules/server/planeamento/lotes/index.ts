import {
  deleteOpLotesBd,
  getOpLotesDb,
  getOpLotesDistDb,
  postOpLotesDb,
  upsertOpLotesDb,
} from "@repo/db/planeamento";
import { PAPEL_ROTA_PLANEAMENTO } from "@repo/tipos/consts";
import {
  DeleteLotesSchema,
  GetOpLotesDistSchema,
  OPschema,
  PostdistPorCaixaSchema,
  PostLoteSchema,
} from "@repo/tipos/planeamento/lotes";
import { TRPCError } from "@trpc/server";

import { createTRPCRouter, roleProtectedProcedure } from "@/init";

const PAPEL_ROTA = PAPEL_ROTA_PLANEAMENTO;

export const planeamentoLotes = createTRPCRouter({
  getOpLotesPedido: roleProtectedProcedure(PAPEL_ROTA)
    .input(OPschema)
    .query(async ({ input }) => {
      try {
        const { op } = input;
        return await getOpLotesDb(op);
      } catch (err) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Erro ao obter pedido...",
          cause: err, // optional, for logging/debugging
        });
      }
    }),
  upsertOpLotes: roleProtectedProcedure(PAPEL_ROTA)
    .input(PostdistPorCaixaSchema)
    .mutation(async ({ ctx, input }) => {
      try {
        const { bostamp, numeroPecaCaixa, qttTamanhosAJuntar } = input;
        const userName = ctx.auth.user.name;
        return await upsertOpLotesDb(
          bostamp,
          numeroPecaCaixa,
          qttTamanhosAJuntar,
          userName,
        );
      } catch (err) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Erro ao inserir dados...",
          cause: err, // optional, for logging/debugging
        });
      }
    }),
  getOpLotesDist: roleProtectedProcedure(PAPEL_ROTA)
    .input(GetOpLotesDistSchema)
    .query(async ({ input }) => {
      try {
        const { Obrano, CaseCapacity, MaxSizesPerCase } = input;
        return await getOpLotesDistDb(Obrano, CaseCapacity, MaxSizesPerCase);
      } catch (err) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Erro ao obter lista...",
          cause: err, // optional, for logging/debugging
        });
      }
    }),
  postOpLotes: roleProtectedProcedure(PAPEL_ROTA)
    .input(PostLoteSchema)
    .mutation(async ({ ctx, input }) => {
      try {
        const payload = JSON.stringify(input);
        const userName = ctx.auth.user.name;
        return await postOpLotesDb(payload, userName);
      } catch (err) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Erro ao inserir Lotes...",
          cause: err, // optional, for logging/debugging
        });
      }
    }),
  delteOpLotes: roleProtectedProcedure(PAPEL_ROTA)
    .input(DeleteLotesSchema)
    .mutation(async ({ ctx, input }) => {
      try {
        const { idLote, bostamp, ref } = input;
        const userName = ctx.auth.user.name;
        return await deleteOpLotesBd(idLote, bostamp, ref, userName);
      } catch (err) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Erro ao eliminar Lotes...",
          cause: err, // optional, for logging/debugging
        });
      }
    }),
});
