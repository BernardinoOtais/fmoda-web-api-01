import {
  getOpAbertasDb,
  getFornecedoresBd,
  postDePlaneamentosDB,
  getPlaneamentosDb,
  getOpCamioesEnviosDb,
  postFornecedorDb,
  postDataDb,
  postQttDb,
} from "@repo/db/planeamento";
import { saveBase64Image } from "@repo/imagens";
import { PAPEL_ROTA_PLANEAMENTO } from "@repo/tipos/consts";
import { uploadPhotoSchema } from "@repo/tipos/foto";
import {
  GetPlaneamentosSchemas,
  PosNovoPlaneamentoSchema,
  PostDeDataSchema,
  PostDeQttSchema,
  PostFornecedorSchema,
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
  postDeData: roleProtectedProcedure(PAPEL_ROTA)
    .input(PostDeDataSchema)
    .mutation(async ({ input }) => {
      try {
        const { op, variavel, nData, data } = input;
        await postDataDb(op, variavel, nData, data);
      } catch (err) {
        console.log(err);
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Erro ao inserir data..",
          cause: err, // optional, for logging/debugging
        });
      }
    }),
  postDeQtt: roleProtectedProcedure(PAPEL_ROTA)
    .input(PostDeQttSchema)
    .mutation(async ({ input }) => {
      try {
        const { op, variavel, nQtt, qtt } = input;

        await postQttDb(op, variavel, nQtt, qtt);
      } catch (err) {
        console.log(err);
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Erro ao inserir Qtt..",
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

//postFornecedorDb
//getOpCamioesEnviosDb
//postDePlaneamentosDB
//PostDeQttSchema
