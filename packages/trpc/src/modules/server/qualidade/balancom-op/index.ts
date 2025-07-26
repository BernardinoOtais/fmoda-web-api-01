import {
  bmVerificoNovaFaturas,
  deleteBmApagaMalhaBd,
  deleteOpBd,
  deleteTcBd,
  getBmDataViaIdBd,
  getBmViaOpBd,
  getOpsCompativeisBd,
  getTcsssBd,
  patchBmDefeitosBd,
  patchBmLotesBd,
  postBmDefeitoFioDb,
  postBmIdBmOpnFaturaCmrObsBd,
  postBmIdBmOpnFaturaPesoLisquidoPesoBrutoBd,
  postBmLoteFioBd,
  postBmQuantidadeSeUnidadeBd,
  postOpBMExistenteBd,
  postTcNovoBd,
  resetBmBd,
} from "@repo/db/qualidade_balancom_op";
import { NewIdSql } from "@repo/tipos/comuns";
import { PAPEL_ROTA_QUALIDADE } from "@repo/tipos/consts";
import {
  BmAlteraNomeLoteFio,
  BmTcSchema,
  DeleteApagaMalhaSchema,
  IdBmOpEmTextoSchema,
  IdBmOpSchema,
  OPschema,
  PostBmIdBmOpnFaturaCmrObsSchema,
  PostBmIdBmOpnFaturaPesoLisquidoPesoBrutoSchema,
  PostDeDefeitosFio,
  PostDeDefeitosSchema,
  PostDeLotesSchema,
  PostDeQuantidadeSeUnidade,
} from "@repo/tipos/qualidade_balancom";
import { TRPCError } from "@trpc/server";

import { createTRPCRouter, roleProtectedProcedure } from "@/init";

const PAPEL_ROTA = PAPEL_ROTA_QUALIDADE;

export const qualidade_balancom_op = createTRPCRouter({
  getBmViaOp: roleProtectedProcedure(PAPEL_ROTA)
    .input(OPschema)
    .query(async ({ input }) => {
      try {
        return await getBmViaOpBd(input);
      } catch (err) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Erro ao obter envio de acessórios.",
          cause: err,
        });
      }
    }),
  getTcsss: roleProtectedProcedure(PAPEL_ROTA)
    .input(NewIdSql)
    .query(async ({ input }) => {
      try {
        return await getTcsssBd(input);
      } catch (err) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Erro ao obter tcsss.",
          cause: err,
        });
      }
    }),
  getBmDataViaId: roleProtectedProcedure(PAPEL_ROTA)
    .input(NewIdSql)
    .query(async ({ input }) => {
      try {
        return await getBmDataViaIdBd(input);
      } catch (err) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Erro ao obter Bms desta op...",
          cause: err,
        });
      }
    }),
  getOpsCompativeis: roleProtectedProcedure(PAPEL_ROTA)
    .input(NewIdSql)
    .query(async ({ input }) => {
      try {
        return await getOpsCompativeisBd(input);
      } catch (err) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Erro ao obter Ops compativeis...",
          cause: err,
        });
      }
    }),
  deleteTc: roleProtectedProcedure(PAPEL_ROTA)
    .input(BmTcSchema)
    .mutation(async ({ input }) => {
      try {
        return await deleteTcBd(input);
      } catch (err) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Erro ao apagar tc...",
          cause: err,
        });
      }
    }),
  postTcNovo: roleProtectedProcedure(PAPEL_ROTA)
    .input(BmTcSchema)
    .mutation(async ({ input }) => {
      try {
        return await postTcNovoBd(input);
      } catch (err) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Erro ao inserir tc...",
          cause: err,
        });
      }
    }),
  deleteBmApagaMalha: roleProtectedProcedure(PAPEL_ROTA)
    .input(DeleteApagaMalhaSchema)
    .mutation(async ({ input }) => {
      try {
        return await deleteBmApagaMalhaBd(input);
      } catch (err) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Erro ao apagar malha...",
          cause: err,
        });
      }
    }),
  patchBmDefeitos: roleProtectedProcedure(PAPEL_ROTA)
    .input(PostDeDefeitosSchema)
    .mutation(async ({ input }) => {
      try {
        return await patchBmDefeitosBd(input);
      } catch (err) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Erro ao alterar a malha...",
          cause: err,
        });
      }
    }),
  patchbmLotes: roleProtectedProcedure(PAPEL_ROTA)
    .input(PostDeLotesSchema)
    .mutation(async ({ input }) => {
      try {
        return await patchBmLotesBd(input);
      } catch (err) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Erro ao alterar a lote da malha...",
          cause: err,
        });
      }
    }),
  deleteOp: roleProtectedProcedure(PAPEL_ROTA)
    .input(IdBmOpSchema)
    .mutation(async ({ input }) => {
      try {
        return await deleteOpBd(input);
      } catch (err) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Erro ao apagar op...",
          cause: err,
        });
      }
    }),
  postBmIdBmOpnFaturaCmrObs: roleProtectedProcedure(PAPEL_ROTA)
    .input(PostBmIdBmOpnFaturaCmrObsSchema)
    .mutation(async ({ input }) => {
      try {
        return await postBmIdBmOpnFaturaCmrObsBd(input);
      } catch (err) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Erro ao inserir CMR...",
          cause: err,
        });
      }
    }),
  postBmIdBmOpnFaturaPesoLisquidoPesoBruto: roleProtectedProcedure(PAPEL_ROTA)
    .input(PostBmIdBmOpnFaturaPesoLisquidoPesoBrutoSchema)
    .mutation(async ({ input }) => {
      try {
        return await postBmIdBmOpnFaturaPesoLisquidoPesoBrutoBd(input);
      } catch (err) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Erro ao inserir dados...",
          cause: err,
        });
      }
    }),
  postNovaOp: roleProtectedProcedure(PAPEL_ROTA)
    .input(IdBmOpSchema)
    .mutation(async ({ input }) => {
      try {
        const resultado = await postOpBMExistenteBd(input);

        const resultadoFinal = resultado[0]?.estado;

        if (!resultadoFinal)
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Erro ao tentar inseris Op...",
          });

        return resultadoFinal;
      } catch (err) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Erro ao inserir dados...",
          cause: err,
        });
      }
    }),
  postVerificoNovaFaturas: roleProtectedProcedure(PAPEL_ROTA)
    .input(IdBmOpEmTextoSchema)
    .mutation(async ({ input }) => {
      try {
        return await bmVerificoNovaFaturas(input);
      } catch (err) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Erro ao actualizar faturas...",
          cause: err,
        });
      }
    }),
  resetBs: roleProtectedProcedure(PAPEL_ROTA)
    .input(IdBmOpEmTextoSchema)
    .mutation(async ({ input }) => {
      try {
        return await resetBmBd(input);
      } catch (err) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Erro ao fazer reset...",
          cause: err,
        });
      }
    }),
  postBmLoteFio: roleProtectedProcedure(PAPEL_ROTA)
    .input(BmAlteraNomeLoteFio)
    .mutation(async ({ input }) => {
      try {
        return await postBmLoteFioBd(input);
      } catch (err) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Erro ao inserir lotes...",
          cause: err,
        });
      }
    }),
  postBmDefeitoFio: roleProtectedProcedure(PAPEL_ROTA)
    .input(PostDeDefeitosFio)
    .mutation(async ({ input }) => {
      try {
        return await postBmDefeitoFioDb(input);
      } catch (err) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Erro ao inserir defeitos...",
          cause: err,
        });
      }
    }),
  postBmQuantidadeSeUnidade: roleProtectedProcedure(PAPEL_ROTA)
    .input(PostDeQuantidadeSeUnidade)
    .mutation(async ({ input }) => {
      try {
        return await postBmQuantidadeSeUnidadeBd(input);
      } catch (err) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Erro ao actualizar quantidade se unidade...",
          cause: err,
        });
      }
    }),
});
