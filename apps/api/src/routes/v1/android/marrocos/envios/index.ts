import { validaSchema } from "@middlewares/valida-schema";
import {
  getEnvio,
  postNovoEnvio,
  deleteEnvio,
} from "@repo/db/android/marrocos/envios";
import {
  EmvioApagaSchema,
  NomeEnvioPostSchema,
  NomeEnvioSchema,
} from "@repo/tipos/android/marrocos/envios";
import HttpStatusCode from "@utils/http-status-code";
import { Router } from "express";

import routesMarrocosEnviosFim from "./fim";

import type { Response, Request, NextFunction } from "express";

const routesMarrocosEnvios = Router();

routesMarrocosEnvios.get(
  "/",
  validaSchema(NomeEnvioSchema, "query"),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { nomeEnvio } = NomeEnvioSchema.parse(req.query);

      const dados = await getEnvio(nomeEnvio);

      res.status(HttpStatusCode.OK).json(dados);
    } catch (error) {
      next(error);
    }
  }
);

routesMarrocosEnvios.post(
  "/",
  validaSchema(NomeEnvioPostSchema),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const body = NomeEnvioPostSchema.parse(req.body);

      const dados = await postNovoEnvio(body);

      res.status(HttpStatusCode.OK).json(dados);
    } catch (error) {
      next(error);
    }
  }
);

routesMarrocosEnvios.delete(
  "/:idEnvioMarrocos",
  validaSchema(EmvioApagaSchema, "params"),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { idEnvioMarrocos } = EmvioApagaSchema.parse(req.params);
      const dados = await deleteEnvio(idEnvioMarrocos);
      res.status(HttpStatusCode.OK).json(dados);
    } catch (error) {
      next(error);
    }
  }
);

routesMarrocosEnvios.use("/fim/", routesMarrocosEnviosFim);

export default routesMarrocosEnvios;
