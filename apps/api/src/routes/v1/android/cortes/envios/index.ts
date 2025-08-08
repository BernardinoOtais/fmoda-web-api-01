import { validaSchema } from "@middlewares/valida-schema";
import {
  getCortesEnvios,
  postCortesEnvio,
} from "@repo/db/android/cortes/envios";
import {
  GetEnviosSchema,
  PostCortesEnvioSchema,
} from "@repo/tipos/android/cortes/envios";
import HttpStatusCode from "@utils/http-status-code";
import { Router } from "express";

import routesLotes from "./lotes";

import type { Response, Request, NextFunction } from "express";

const routesEnvios = Router();

routesEnvios.use("/lotes/", routesLotes);

routesEnvios.get(
  "/",
  validaSchema(GetEnviosSchema, "query"),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { opIcf } = GetEnviosSchema.parse(req.query);

      const dados = await getCortesEnvios(opIcf);

      res.status(HttpStatusCode.OK).json(dados);
    } catch (error) {
      next(error);
    }
  }
);

routesEnvios.post(
  "/",
  validaSchema(PostCortesEnvioSchema, "query"),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { nomeUser } = PostCortesEnvioSchema.parse(req.query);

      const dados = await postCortesEnvio(nomeUser);

      res.status(HttpStatusCode.OK).json(dados);
    } catch (error) {
      next(error);
    }
  }
);

export default routesEnvios;
