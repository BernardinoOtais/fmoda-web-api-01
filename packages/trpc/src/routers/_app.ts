import { createTRPCRouter } from "@/init";
import { administrador } from "@/modules/server/administrador";
import { embarques_configorar } from "@/modules/server/embarques/configurar";
import { embarques_idEnvio } from "@/modules/server/embarques/id-envio";
import { embarques } from "@/modules/server/embarques/raiz";
import { fotosGeraisFmoda } from "@/modules/server/fotos/gerais";
import { joanaCortesPorOp } from "@/modules/server/joana/cortes-por-op";
import { joanaEntradasMcMa } from "@/modules/server/joana/entradas-mc-ma";
import { joanaEnviosAMarrocos } from "@/modules/server/joana/envios-marrocos";
import { joanaEstampadosEBordados } from "@/modules/server/joana/est-e-borda";
import { joanaFaturacao } from "@/modules/server/joana/faturacao";
import { joanaFaturacaoPlaneada } from "@/modules/server/joana/faturas-planeadas";
import { planeamento } from "@/modules/server/planeamento";
import { qualidade_balancom_op_composicao } from "@/modules/server/qualidade/balanco-op-composicao";
import { qualidade_balancom } from "@/modules/server/qualidade/balancom";
import { qualidade_balancom_op } from "@/modules/server/qualidade/balancom-op";
import { rfid } from "@/modules/server/rfid";

export const appRouter = createTRPCRouter({
  administrador: administrador,

  embarques: embarques,

  embarquesIdEnvio: embarques_idEnvio,

  embarquesConfigurar: embarques_configorar,

  qualidadeBalancoM: qualidade_balancom,

  qualidade_balancom_op,

  qualidade_balancom_op_composicao,

  planeamento,

  fotosGeraisFmoda,

  joanaEntradasMcMa,

  joanaEstampadosEBordados,

  joanaCortesPorOp,

  joanaFaturacao,

  joanaFaturacaoPlaneada,

  joanaEnviosAMarrocos,

  rfid,
});

export type AppRouter = typeof appRouter;
