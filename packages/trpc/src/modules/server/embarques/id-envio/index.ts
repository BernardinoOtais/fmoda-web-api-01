import { createTRPCRouter, roleProtectedProcedure } from "@/init";
import {
  IdNumeroInteiroNaoNegativoDto,
  IdNumeroInteiroNaoNegativoSchema,
  InteiroNaoNegativoSchema,
  RespostaRecebidaSchema,
} from "@repo/tipos/comuns";
import {
  deleteConteudosDb,
  getContainersConteudoToPrintDb,
  getContainersDb,
  getConteudoDb,
  getEnvioDb,
  getSelectedContainersDb,
  getUnidadesEItensEOpsDb,
  patchFornecedorDb,
  postAlturaContrainerDb,
  postConteudoDb,
} from "@repo/db/embarques_idenvio";
import {
  deleteContainerOpsByOpDb,
  execInsereOpDb,
  getContainerDb,
  getContainerOpDb,
  getContainersidPaiidEnvioTipodb,
  getNumeroDeConteudosComEstaOpDb,
  getNumeroDeOrdemSeSubContainerDb,
  getNumeroDeOrdemSeSubContainerTipoDb,
  getOpDb,
  getEnvioDb as getSoEnvioDb,
  getTodosContainersIdContainerDb,
  postContainerDb,
  postManyContainerOpDb,
  postOrdenaContainerDb,
  verificoSeContainerTemSubContainersDb,
  verificoSeContainerTemConteudoDb,
  deleteConatinerDb,
} from "@repo/db/embarques";
import { PAPEL_ROTA_EMBARQUES, PermiteSubcontainer } from "@repo/tipos/consts";

import { TRPCError } from "@trpc/server";
import {
  IdEnvioIdContainerSchema,
  IdOpSchema,
  ListaIdsSchema,
  PostAlturaSchema,
  PostConteudoSchema,
  PostDestinoSchema,
  PostOpSchema,
} from "@repo/tipos/embarques_idenvio";
import {
  IdOrdemSchema,
  ListaDeContainersEnvioDto,
  PostContainerSchema,
} from "@repo/tipos/embarques";

const PAPEL_ROTA = PAPEL_ROTA_EMBARQUES;

export const embarques_idEnvio = createTRPCRouter({
  getEnvio: roleProtectedProcedure(PAPEL_ROTA)
    .input(IdNumeroInteiroNaoNegativoSchema)
    .query(async ({ input }) => {
      try {
        return await getEnvioDb(input);
      } catch (err) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Erro ao obter envio de acessórios.",
          cause: err, // optional, for logging/debugging
        });
      }
    }),
  getSelectedContainers: roleProtectedProcedure(PAPEL_ROTA)
    .input(IdNumeroInteiroNaoNegativoSchema)
    .query(async (input) => {
      const dados: IdNumeroInteiroNaoNegativoDto = input.input;

      try {
        return await getSelectedContainersDb(dados);
      } catch (err) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Erro ao obter envio de getSelectedContainers.",
          cause: err, // optional, for logging/debugging
        });
      }
    }),
  getContainers: roleProtectedProcedure(PAPEL_ROTA)
    .input(IdNumeroInteiroNaoNegativoSchema)
    .query(async (input) => {
      const dados: IdNumeroInteiroNaoNegativoDto = input.input;

      try {
        return await getContainersDb(dados);
      } catch (err) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Erro ao obter envio de getContainers.",
          cause: err, // optional, for logging/debugging
        });
      }
    }),
  getContainersConteudoToPrint: roleProtectedProcedure(PAPEL_ROTA)
    .input(IdEnvioIdContainerSchema)
    .query(async ({ input }) => {
      try {
        return await getContainersConteudoToPrintDb(
          input.idEnvio,
          input.idContainer
        );
      } catch (err) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Erro ao obter dados para imprimir...",
          cause: err, // optional, for logging/debugging
        });
      }
    }),
  patchFornecedor: roleProtectedProcedure(PAPEL_ROTA)
    .input(PostDestinoSchema)
    .mutation(async (input) => {
      try {
        const envio = await getSoEnvioDb(input.input.idEnvio);
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
        const { idEnvio, idDestino } = input.input;

        return await patchFornecedorDb({
          idEnvio,
          idDestino,
        });
      } catch (err) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Erro ao alterar destino.",
          cause: err, // optional, for logging/debugging
        });
      }
    }),
  postNovoContainer: roleProtectedProcedure(PAPEL_ROTA)
    .input(PostContainerSchema)
    .mutation(async (input) => {
      try {
        const { idContainerPai, idTipoContainer } = input.input;

        if (!idContainerPai) {
          const munmeroMinimoParacontainerInicial = 3;
          if (idTipoContainer <= munmeroMinimoParacontainerInicial) {
            const containerPrincipalJaExiste =
              await getContainersidPaiidEnvioTipodb(input.input);
            if (containerPrincipalJaExiste.length > 0) {
              throw new TRPCError({
                code: "PRECONDITION_FAILED",
                message: `Já existe este container Principal...`,
              });
            }
            const ordem = await getNumeroDeOrdemSeSubContainerDb(input.input);
            const containerSeguinte = ordem + 1;
            return await postContainerDb(input.input, containerSeguinte, 1);
          }
          throw new TRPCError({
            code: "PRECONDITION_FAILED",
            message: `Não pode inserir este container...`,
          });
        }

        const containerPai = await getContainerDb(idContainerPai);

        const idTipoContainerPai =
          containerPai?.idTipoContainer as keyof typeof PermiteSubcontainer;

        const listaDeSubContainersDisponiveis =
          idContainerPai && PermiteSubcontainer[idTipoContainerPai];

        if (!listaDeSubContainersDisponiveis) {
          return {
            success: false,
            error: `Não há sub-containers diponiveis... `,
          };
        }
        const nContainer = await getNumeroDeOrdemSeSubContainerTipoDb(
          input.input
        );
        const ordem = await getNumeroDeOrdemSeSubContainerDb(input.input);

        const containerSeguinte = ordem + 1;
        const nContainerSeguinte = nContainer + 1;
        return await postContainerDb(
          input.input,
          containerSeguinte,
          nContainerSeguinte
        );
      } catch (err) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Erro ao inserir container.",
          cause: err, // optional, for logging/debugging
        });
      }
    }),
  postAlturaContrainer: roleProtectedProcedure(PAPEL_ROTA)
    .input(PostAlturaSchema)
    .mutation(async (input) => {
      try {
        return await postAlturaContrainerDb(input.input);
      } catch (err) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Erro ao alterar altura...",
          cause: err, // optional, for logging/debugging
        });
      }
    }),

  insiroOpEmContainer: roleProtectedProcedure(PAPEL_ROTA)
    .input(PostOpSchema)
    .mutation(async (input) => {
      try {
        const { id, op } = input.input.PostOp;
        const containerOpExistente = await getContainerOpDb(id, op);

        if (containerOpExistente) {
          throw new TRPCError({
            code: "FORBIDDEN",
            message: "Op Já existe...",
          });
        }

        const opExistente = await getOpDb(op);

        if (!opExistente || opExistente.length === 0) {
          const procedureResult = await execInsereOpDb(op);
          const resposta = RespostaRecebidaSchema.parse(procedureResult);
          if (resposta && resposta[0] && resposta[0].status !== "ok") {
            throw new TRPCError({
              code: "FORBIDDEN",
              message: "Errro ao inserir a Op...",
            });
          }
        }

        const getTodosContainersIdContainer =
          await getTodosContainersIdContainerDb(id);

        const dadosAInserir = getTodosContainersIdContainer.map((c) => ({
          idContainer: c,
          op: op,
        }));

        await postManyContainerOpDb(dadosAInserir);
      } catch (err) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Erro ao inserir Op....",
          cause: err, // optional, for logging/debugging
        });
      }
    }),
  apagoOpContainer: roleProtectedProcedure(PAPEL_ROTA)
    .input(IdOpSchema)
    .mutation(async (input) => {
      try {
        const { id, op } = input.input;
        const listaDeContainers = await getTodosContainersIdContainerDb(id);
        if (!listaDeContainers || listaDeContainers.length === 0) {
          throw new TRPCError({
            code: "FORBIDDEN",
            message: "Nada a apagar...",
          });
        }

        const numeroConteudosDestaOp = await getNumeroDeConteudosComEstaOpDb(
          listaDeContainers,
          op
        );
        if (numeroConteudosDestaOp > 0) {
          throw new TRPCError({
            code: "FORBIDDEN",
            message: "Nāo pode apagar op, já há conteudo com esta op...",
          });
        }
        await deleteContainerOpsByOpDb(listaDeContainers, op);
      } catch (err) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Erro ao apagar op..",
          cause: err, // optional, for logging/debugging
        });
      }
    }),
  postOrdenaContainer: roleProtectedProcedure(PAPEL_ROTA)
    .input(IdOrdemSchema)
    .mutation(async (input) => {
      try {
        const resposta: ListaDeContainersEnvioDto = await postOrdenaContainerDb(
          input.input
        );
        if (!resposta) {
          throw new TRPCError({
            code: "FORBIDDEN",
            message: "Nāo pode apagar op, já há conteudo com esta op...",
          });
        }
        return resposta;
      } catch (err) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Erro a ordenar...",
          cause: err, // optional, for logging/debugging
        });
      }
    }),
  apagoContainer: roleProtectedProcedure(PAPEL_ROTA)
    .input(InteiroNaoNegativoSchema)
    .mutation(async (input) => {
      try {
        const containerTemSubcontainers =
          await verificoSeContainerTemSubContainersDb(input.input);
        if (containerTemSubcontainers) {
          throw new TRPCError({
            code: "FORBIDDEN",
            message: "Nāo pode apagar container, tem subcontainers...",
          });
        }
        const verificoSeContainerTemConteudo =
          await verificoSeContainerTemConteudoDb(input.input);
        if (verificoSeContainerTemConteudo) {
          throw new TRPCError({
            code: "FORBIDDEN",
            message: "Nāo pode apagar container, tem conteudo...",
          });
        }
        await deleteConatinerDb(input.input);
      } catch (err) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Erro a apagar conatiner...",
          cause: err, // optional, for logging/debugging
        });
      }
    }),
  getConteudo: roleProtectedProcedure(PAPEL_ROTA)
    .input(IdNumeroInteiroNaoNegativoSchema)
    .query(async ({ input }) => {
      try {
        return await getConteudoDb(input);
      } catch (err) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Erro ao obter conteudo...",
          cause: err, // optional, for logging/debugging
        });
      }
    }),

  getUnidadesEItensEOps: roleProtectedProcedure(PAPEL_ROTA)
    .input(IdNumeroInteiroNaoNegativoSchema)
    .query(async ({ input }) => {
      try {
        return await getUnidadesEItensEOpsDb(input);
      } catch (err) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Erro ao obter conteudo...",
          cause: err, // optional, for logging/debugging
        });
      }
    }),
  //postConteudoDb
  postConteudo: roleProtectedProcedure(PAPEL_ROTA)
    .input(PostConteudoSchema)
    .mutation(async ({ input }) => {
      try {
        console.log("roleProtectedProcedure :", { input });
        await postConteudoDb(input);
      } catch (err) {
        console.log("postConteudoDb err: ", err);
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Erro ao inserir conteudo...",
          cause: err, // optional, for logging/debugging
        });
      }
    }),

  //deleteConteudosDb
  deleteConteudos: roleProtectedProcedure(PAPEL_ROTA)
    .input(ListaIdsSchema)
    .mutation(async ({ input }) => {
      try {
        await deleteConteudosDb(input);
      } catch (err) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Erro ao inserir conteudo...",
          cause: err, // optional, for logging/debugging
        });
      }
    }),
});
