import { checkAuth } from "@middlewares/android/check-auth";
import { validaSchema } from "@middlewares/valida-schema";
import { getResumo } from "@repo/db/android/resumo";
import {
  DadosResumoLinhasSchema,
  GetResumoSchema,
} from "@repo/tipos/android/resumo";
import HttpStatusCode from "@utils/http-status-code";
import { safeParseJson, sendInternalError } from "@utils/utils";
import { Router } from "express";

import type { Response, Request } from "express";

const routesResumo = Router();

/**
 * Auth verification
 */
routesResumo.use(checkAuth());

routesResumo.get(
  "/:op",
  validaSchema(GetResumoSchema, "params"),
  async (req: Request, res: Response) => {
    try {
      const { op } = GetResumoSchema.parse(req.params);
      const dados = await getResumo(op);

      const linhas = DadosResumoLinhasSchema.parse(dados);

      const dadosTratados = linhas.map((item) => ({
        ...item,
        pedido: safeParseJson(item.pedido),
        enviado: safeParseJson(item.enviado),
        enviadoFornecedor: safeParseJson(item.enviadoFornecedor),
        enviadoTotalPorPartes: safeParseJson(item.enviadoTotalPorPartes),
        faltaEnviar: safeParseJson(item.faltaEnviar),
        phc: safeParseJson(item.phc),
        malha: safeParseJson(item.malha),
        resumoResumo: safeParseJson(item.resumoResumo),
      }));

      //      console.log("Os tais dados tratados: ", dadosTratados);
      res.status(HttpStatusCode.OK).json(dadosTratados);
    } catch (error) {
      return sendInternalError(res, error);
    }
  }
);

export default routesResumo;
