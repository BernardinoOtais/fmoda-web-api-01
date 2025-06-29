import { baseProcedure, createTRPCRouter } from "@/init";
import { z } from "zod";

import { embarques } from "@/modules/server/embarques";

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
});

export type AppRouter = typeof appRouter;
