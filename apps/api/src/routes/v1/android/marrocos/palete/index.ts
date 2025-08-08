import { validaSchema } from "@middlewares/valida-schema";
import {
  deletePalete,
  getPaletes,
  postPalete,
} from "@repo/db/android/marrocos/paletes";
import {
  GetPaletesSchema,
  PostNovaPaleteSchema,
} from "@repo/tipos/android/marrocos/paletes";
import HttpStatusCode from "@utils/http-status-code";
import { Router } from "express";

import type { Response, Request, NextFunction } from "express";

const routesMarrocosPaletes = Router();

routesMarrocosPaletes.get(
  "/:idEnvioMarrocos",
  validaSchema(GetPaletesSchema, "params"),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { idEnvioMarrocos } = GetPaletesSchema.parse(req.params);
      const dados = await getPaletes(idEnvioMarrocos);

      res.status(HttpStatusCode.OK).json(dados);
    } catch (error) {
      next(error);
    }
  }
);

routesMarrocosPaletes.post(
  "/",
  validaSchema(PostNovaPaleteSchema),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const body = PostNovaPaleteSchema.parse(req.body);

      const dados = await postPalete(body);

      res.status(HttpStatusCode.OK).json(dados);
    } catch (error) {
      next(error);
    }
  }
);

routesMarrocosPaletes.delete(
  "/:idEnvioMarrocos",
  validaSchema(GetPaletesSchema, "params"),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { idEnvioMarrocos } = GetPaletesSchema.parse(req.params);
      const dados = await deletePalete(idEnvioMarrocos);

      res.status(HttpStatusCode.OK).json(dados);
    } catch (error) {
      next(error);
    }
  }
);

export default routesMarrocosPaletes;
