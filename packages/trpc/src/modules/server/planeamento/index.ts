import {
  getOpAbertasDb,
  getFornecedoresBd,
  postDePlaneamentosDB,
  getPlaneamentosDb,
  getOpCamioesEnviosDb,
  postFornecedorDb,
  getPlaneamentoViaOrcamentoDb,
  deleteDataEQuantidadeBd,
  postDePlaneamentoDataEQttDb,
  patchDePlaneamentoDataEQttDb,
  postObsDb,
  deleteFornecedorValorizadoBd,
  upsertDescValorDb,
  upsertDataEValorDb,
  deleteDataEQttBd,
} from "@repo/db/planeamento";
import { saveBase64Image } from "@repo/imagens";
import { PAPEL_ROTA_PLANEAMENTO } from "@repo/tipos/consts";
import { uploadPhotoSchema } from "@repo/tipos/foto";
import {
  DeleteDataEQttPlaneamentoSchema,
  DeleteDataEQttSchema,
  DeleteFornecedorValorizadoSchema,
  GetPlaneamentosSchemas,
  GetPlaneamentoViaOrcamentoSchema,
  PatchtDePlaneamentoDataEQttchema,
  PosNovoPlaneamentoSchema,
  PostDePlaneamentoDataEQttchema,
  PostFornecedorSchema,
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
  postFornecedor: roleProtectedProcedure(PAPEL_ROTA)
    .input(PostFornecedorSchema)
    .mutation(async ({ input }) => {
      try {
        const { fornecedor, op } = input;
        if (!fornecedor || !op)
          throw new TRPCError({
            code: "PARSE_ERROR",
            message: "Erro ao inserir fornecedor..",
          });
        await postFornecedorDb(fornecedor, op.toString());
      } catch (err) {
        console.log(err);
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Erro ao inserir fornecedor..",
          cause: err, // optional, for logging/debugging
        });
      }
    }),
  deleteDataEQuantidade: roleProtectedProcedure(PAPEL_ROTA)
    .input(DeleteDataEQttPlaneamentoSchema)
    .mutation(async ({ input }) => {
      try {
        await deleteDataEQuantidadeBd(
          input.op,
          input.tipoD,
          input.tipoQ,
          input.nTipo
        );
      } catch (err) {
        console.log(err);
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Erro ao Apagar palaneamento...",
          cause: err, // optional, for logging/debugging
        });
      }
    }),
  deleteDataEQtt: roleProtectedProcedure(PAPEL_ROTA)
    .input(DeleteDataEQttSchema)
    .mutation(async ({ input }) => {
      try {
        await deleteDataEQttBd(input.idDataQtt);
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
    .mutation(async ({ input }) => {
      try {
        await deleteFornecedorValorizadoBd(input.idValorizado);
      } catch (err) {
        console.log(err);
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Erro ao Apagar...",
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
  postDePlaneamentoDataEQttDb: roleProtectedProcedure(PAPEL_ROTA)
    .input(PostDePlaneamentoDataEQttchema)
    .mutation(async ({ input }) => {
      try {
        const { op, tipoD, tipoQ, data, qtt } = input;
        return postDePlaneamentoDataEQttDb(op, tipoD, tipoQ, data, qtt);
      } catch (err) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Erro ao inserir Planeamento...",
          cause: err, // optional, for logging/debugging
        });
      }
    }),
  patchPlaneamentoDataEQttDb: roleProtectedProcedure(PAPEL_ROTA)
    .input(PatchtDePlaneamentoDataEQttchema)
    .mutation(async ({ input }) => {
      try {
        const { op, tipoD, tipoQ, nTipo, data, qtt } = input;
        console.log("o tais input :", input);
        return patchDePlaneamentoDataEQttDb(op, tipoD, tipoQ, nTipo, data, qtt);
      } catch (err) {
        console.log(err);
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Erro ao alterar Planeamento...",
          cause: err, // optional, for logging/debugging
        });
      }
    }),
  postObs: roleProtectedProcedure(PAPEL_ROTA)
    .input(PostObsSchema)
    .mutation(async ({ input }) => {
      try {
        const { bostamp, obs } = input;
        return postObsDb(bostamp, obs);
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
    .mutation(async ({ input }) => {
      try {
        const { idValorizado, bostamp, nome, nTipo, valorServico } = input;
        console.log("aqui as cenas");
        return upsertDescValorDb(
          idValorizado,
          bostamp,
          nome,
          nTipo,
          valorServico
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
    .mutation(async ({ input }) => {
      try {
        const { idDataQtt, bostamp, data, nTipo, qtt } = input;
        console.log("aqui as cenas");
        return upsertDataEValorDb(idDataQtt, bostamp, data, nTipo, qtt);
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
//upsertDataEValorDb

//deleteDataEQttBd
