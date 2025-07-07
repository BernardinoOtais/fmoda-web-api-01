import { baseProcedure, createTRPCRouter } from "@/init";
import { z } from "zod";

import { embarques } from "@/modules/server/embarques/raiz";
import { embarques_idEnvio } from "@/modules/server/embarques/id-envio";

export const appRouter = createTRPCRouter({
  hello: baseProcedure
    .input(
      z.object({
        text: z.string(),
      })
    )
    .query((opts) => {
      return {
        greeting: `hello ${opts.input.text}`,
      };
    }),
  getEnviosAcessorios: embarques.getEnviosAcessoriosDb,
  getDestinosDisponiveis: embarques.getDestinosDisponiveisBd,
  posPatchEnvio: embarques.posPatchEnvioBd,
  deleteEnvio: embarques.deleteEnvioDb,

  getEnvio: embarques_idEnvio.getEnvioDb,
  getSelectedContainers: embarques_idEnvio.getSelectedContainersDb,
  getContainers: embarques_idEnvio.getContainersDb,

  patchFornecedor: embarques_idEnvio.patchFornecedorDb,
  postNovoContainer: embarques_idEnvio.postNovoContainerDb,
  postAlturaContrainer: embarques_idEnvio.postAlturaContrainerDb,

  insiroOpEmContainer: embarques_idEnvio.insiroOpEmContainerDb,
  apagoOpContainer: embarques_idEnvio.apagoOpContainerDb,
  postOrdenaContainer: embarques_idEnvio.postOrdenaContainerDb,
  apagoContainer: embarques_idEnvio.apagoContainerDb,
  getContainersConteudoToPrint:
    embarques_idEnvio.getContainersConteudoToPrintDb,
  getConteudo: embarques_idEnvio.getConteudoDb,
  getUnidadesEItensEOps: embarques_idEnvio.getUnidadesEItensEOpsDb,
  postConteudo: embarques_idEnvio.postConteudoDb,
  deleteConteudos: embarques_idEnvio.deleteConteudosDb,
});

export type AppRouter = typeof appRouter;
