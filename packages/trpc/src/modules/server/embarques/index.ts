// get este getEnviosAcessoriosDb

import { createTRPCRouter, roleProtectedProcedure } from "@/init";
import { DadosParaPesquisaComPaginacaoEOrdemSchema } from "@repo/tipos/comuns";

import {
  getDestinosDisponiveisBd,
  getEnviosAcessoriosDb,
  posPatchEnvioBd,
  getEnvioDb,
  getContainersDb,
  deleteEnvioDb,
} from "@repo/db/embarques";
import { TRPCError } from "@trpc/server";
import { IdEnvioSchema, PostNovoEnvioSchema } from "@repo/tipos/embarques";

const PAPEL_ROTA = "Embarques";
export const embarques = createTRPCRouter({
  getEnviosAcessoriosDb: roleProtectedProcedure(PAPEL_ROTA)
    .input(DadosParaPesquisaComPaginacaoEOrdemSchema)
    .query(async ({ input }) => {
      try {
        return await getEnviosAcessoriosDb(input);
      } catch (err) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Erro ao obter envios de acessórios.",
          cause: err, // optional, for logging/debugging
        });
      }
    }),
  getDestinosDisponiveisBd: roleProtectedProcedure(PAPEL_ROTA).query(
    async () => {
      try {
        return await getDestinosDisponiveisBd();
      } catch (err) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Erro ao obter destinos.",
          cause: err, // optional, for logging/debugging
        });
      }
    }
  ),
  posPatchEnvioBd: roleProtectedProcedure(PAPEL_ROTA)
    .input(PostNovoEnvioSchema)
    .mutation(async ({ input, ctx }) => {
      try {
        const { auth } = ctx;
        return await posPatchEnvioBd({ ...input, nomeUser: auth.user.name });
      } catch (err) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Erro ao ao criar ou alterar envio.",
          cause: err, // optional, for logging/debugging
        });
      }
    }),
  deleteEnvioDb: roleProtectedProcedure(PAPEL_ROTA)
    .input(IdEnvioSchema)
    .mutation(async ({ input }) => {
      const { idEnvio } = input;

      const envio = await getEnvioDb(idEnvio);
      if (!envio) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Nada a apagar...",
        });
      }

      if (envio.fechado) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Envio fechado...",
        });
      }

      const containers = await getContainersDb(idEnvio);
      if (containers.length > 0) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Envio tem containers...",
        });
      }

      const data = await deleteEnvioDb(idEnvio);
      console.log("Antes do return deleteEnvioDb...");
      return {
        success: true,
        message: "Envio apagado com sucesso...",
        data,
      };
    }),
});
