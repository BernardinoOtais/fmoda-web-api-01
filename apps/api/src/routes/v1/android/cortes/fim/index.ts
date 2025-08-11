import { validaSchema } from "@middlewares/valida-schema";
import {
  getCortesFimRecursos,
  getCortesFimFornecedores,
  postCortesFim,
} from "@repo/db/android/cortes/fim";
import {
  GetFornecedoresSchema,
  GetRecursosSchema,
  PostFimDeEnvioSchema,
} from "@repo/tipos/android/cortes/fim";
import HttpStatusCode from "@utils/http-status-code";
import { sendInternalError } from "@utils/utils";
import { Router } from "express";

import type { Response, Request } from "express";

const routesFim = Router();

routesFim.get(
  "/recursos/:opLotes",
  validaSchema(GetRecursosSchema, "params"),
  async (req: Request, res: Response) => {
    try {
      const { opLotes } = GetRecursosSchema.parse(req.params);
      const dados = await getCortesFimRecursos(opLotes);

      res.status(HttpStatusCode.OK).json(dados);
    } catch (error) {
      sendInternalError(res, error);
    }
  }
);
routesFim.get(
  "/fornecedores",
  validaSchema(GetFornecedoresSchema, "query"),
  async (req: Request, res: Response) => {
    try {
      const { opLotes, faseProducao, sectorProd, naOP, parteRec } =
        GetFornecedoresSchema.parse(req.query);
      const dados = await getCortesFimFornecedores(
        opLotes,
        faseProducao,
        sectorProd,
        naOP,
        parteRec
      );

      res.status(HttpStatusCode.OK).json(dados);
    } catch (error) {
      sendInternalError(res, error);
    }
  }
);

routesFim.post(
  "/",
  validaSchema(PostFimDeEnvioSchema),
  async (req: Request, res: Response) => {
    try {
      console.log(req);
      const {
        faseLinx,
        idEnvio,
        ip,
        nLotes,
        nomeUser,
        recursoLinx,
        sectorLinx,
      } = PostFimDeEnvioSchema.parse(req.body);
      const dados = await postCortesFim(
        faseLinx,
        idEnvio,
        ip,
        nLotes,
        nomeUser,
        recursoLinx,
        sectorLinx
      );
      res.status(HttpStatusCode.OK).json(dados);
    } catch (error) {
      sendInternalError(res, error);
    }
  }
);
export default routesFim;
