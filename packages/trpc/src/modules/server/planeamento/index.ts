import {
  getOpAbertasDb,
  getFornecedoresBd,
  postDePlaneamentosDB,
  getPlaneamentosDb,
  getOpCamioesEnviosDb,
  getPlaneamentoViaOrcamentoDb,
  postObsDb,
  deleteFornecedorValorizadoBd,
  upsertDescValorDb,
  upsertDataEValorDb,
  deleteDataEQttBd,
} from "@repo/db/planeamento";
import { PAPEL_ROTA_PLANEAMENTO } from "@repo/tipos/consts";
import {
  DeleteDataEQttSchema,
  DeleteFornecedorValorizadoSchema,
  GetPlaneamentosSchemas,
  GetPlaneamentoViaOrcamentoSchema,
  PosNovoPlaneamentoSchema,
  PostObsSchema,
  UpsertDataQttSchema,
  UpsertDescValorSchema,
} from "@repo/tipos/planeamento";
import { OPschema } from "@repo/tipos/qualidade_balancom";
import { TRPCError } from "@trpc/server";

import { createTRPCRouter, roleProtectedProcedure } from "@/init";
//import { delay } from "@/utils/delay";

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
  getPlaneamentos: roleProtectedProcedure(PAPEL_ROTA)
    .input(GetPlaneamentosSchemas)
    .query(async ({ input }) => {
      try {
        // await delay(5000); // waits 2 seconds
        return await getPlaneamentosDb(input.enviado, input.sub_contratado_id);
      } catch (err) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Erro ao obter Planeamentos.",
          cause: err, // optional, for logging/debugging
        });
      }
    }),
  getOpCamioesEnvios: roleProtectedProcedure(PAPEL_ROTA)
    .input(OPschema)
    .query(async ({ input }) => {
      try {
        // await delay(5000); // waits 2 seconds
        return await getOpCamioesEnviosDb(input.op);
      } catch (err) {
        console.log("O tais error : ", err);
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Erro ao obter getOpCamioesEnviosDb.",
          cause: err, // optional, for logging/debugging
        });
      }
    }),
  getPlaneamentoViaOrcamento: roleProtectedProcedure(PAPEL_ROTA)
    .input(GetPlaneamentoViaOrcamentoSchema)
    .query(async ({ input }) => {
      try {
        // await delay(5000); // waits 2 seconds
        return await getPlaneamentoViaOrcamentoDb(input.ano, input.nFicha);
      } catch (err) {
        console.log("O tais error : ", err);
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Erro ao obter palneamento via orçamento...",
          cause: err, // optional, for logging/debugging
        });
      }
    }),
  postDePlaneamentos: roleProtectedProcedure(PAPEL_ROTA)
    .input(PosNovoPlaneamentoSchema)
    .mutation(async ({ input }) => {
      try {
        await postDePlaneamentosDB(input);
      } catch (err) {
        console.log(err);
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Erro ao inserir planeamentos..",
          cause: err, // optional, for logging/debugging
        });
      }
    }),
  deleteDataEQtt: roleProtectedProcedure(PAPEL_ROTA)
    .input(DeleteDataEQttSchema)
    .mutation(async ({ ctx, input }) => {
      try {
        const userName = ctx.auth.user.name;
        await deleteDataEQttBd(input.idDataQtt, userName);
      } catch (err) {
        console.log(err);
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Erro ao apagar...",
          cause: err, // optional, for logging/debugging
        });
      }
    }),
  deleteFornecedorValorizado: roleProtectedProcedure(PAPEL_ROTA)
    .input(DeleteFornecedorValorizadoSchema)
    .mutation(async ({ ctx, input }) => {
      try {
        const userName = ctx.auth.user.name;
        await deleteFornecedorValorizadoBd(input.idValorizado, userName);
      } catch (err) {
        console.log(err);
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Erro ao Apagar...",
          cause: err, // optional, for logging/debugging
        });
      }
    }),
  postObs: roleProtectedProcedure(PAPEL_ROTA)
    .input(PostObsSchema)
    .mutation(async ({ ctx, input }) => {
      try {
        const userName = ctx.auth.user.name;
        const { bostamp, obs } = input;
        return postObsDb(bostamp, obs, userName);
      } catch (err) {
        console.log(err);
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Erro ao alterar Obs do Planeamento...",
          cause: err, // optional, for logging/debugging
        });
      }
    }),
  upsertDescValor: roleProtectedProcedure(PAPEL_ROTA)
    .input(UpsertDescValorSchema)
    .mutation(async ({ ctx, input }) => {
      try {
        const userName = ctx.auth.user.name;
        const { idValorizado, bostamp, nome, nTipo, valorServico } = input;
        console.log("aqui as cenas");
        return upsertDescValorDb(
          idValorizado,
          bostamp,
          nome,
          nTipo,
          valorServico,
          userName
        );
      } catch (err) {
        console.log(err);
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Erro a alterar ou inserir...",
          cause: err, // optional, for logging/debugging
        });
      }
    }),
  upsertDataEValor: roleProtectedProcedure(PAPEL_ROTA)
    .input(UpsertDataQttSchema)
    .mutation(async ({ ctx, input }) => {
      try {
        const userName = ctx.auth.user.name;
        const { idDataQtt, bostamp, data, nTipo, qtt } = input;
        console.log("aqui as cenas");
        return upsertDataEValorDb(
          idDataQtt,
          bostamp,
          data,
          nTipo,
          qtt,
          userName
        );
      } catch (err) {
        console.log(err);
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Erro a alterar ou inserir...",
          cause: err, // optional, for logging/debugging
        });
      }
    }),
});
