import { createTRPCRouter } from "@/init";
import { administrador } from "@/modules/server/administrador";
import { embarques_configorar } from "@/modules/server/embarques/configurar";
import { embarques_idEnvio } from "@/modules/server/embarques/id-envio";
import { embarques } from "@/modules/server/embarques/raiz";
import { qualidade_balancom } from "@/modules/server/qualidade/balancom";

export const appRouter = createTRPCRouter({
  administrador: administrador,

  embarques: embarques,

  embarquesIdEnvio: embarques_idEnvio,

  embarquesConfigurar: embarques_configorar,

  qualidadeBalancoM: qualidade_balancom,
});

export type AppRouter = typeof appRouter;
