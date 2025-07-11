import { createTRPCRouter } from "@/init";

import { administrador } from "@/modules/server/administrador";

import { embarques } from "@/modules/server/embarques/raiz";
import { embarques_idEnvio } from "@/modules/server/embarques/id-envio";
import { embarques_configorar } from "@/modules/server/embarques/configurar";

export const appRouter = createTRPCRouter({
  administrador: administrador,

  embarques: embarques,

  embarquesIdEnvio: embarques_idEnvio,

  embarquesConfigurar: embarques_configorar,
});

export type AppRouter = typeof appRouter;
