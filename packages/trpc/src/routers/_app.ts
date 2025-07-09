import { baseProcedure, createTRPCRouter } from "@/init";
import { z } from "zod";

import { embarques } from "@/modules/server/embarques/raiz";
import { embarques_idEnvio } from "@/modules/server/embarques/id-envio";
import { embarques_configorar } from "@/modules/server/embarques/configurar";

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

  embarques: embarques,

  embarquesIdEnvio: embarques_idEnvio,

  embarquesConfigurar: embarques_configorar,
});

export type AppRouter = typeof appRouter;
