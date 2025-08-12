import { validaSchema } from "@middlewares/valida-schema";
import {
  deleteCortesEnvio,
  getCortesEnvios,
  postCortesEnvio,
} from "@repo/db/android/cortes/envios";
import {
  DeleteCortesEnvioSchema,
  GetEnviosSchema,
  PostCortesEnvioSchema,
} from "@repo/tipos/android/cortes/envios";
import HttpStatusCode from "@utils/http-status-code";
import { sendInternalError } from "@utils/utils";
import { Router } from "express";

import routesLotes from "./lotes";

import type { Response, Request } from "express";

const routesEnvios = Router();

routesEnvios.use("/lotes/", routesLotes);

routesEnvios.get(
  "/",
  validaSchema(GetEnviosSchema, "query"),
  async (req: Request, res: Response) => {
    try {
      const { opIcf } = GetEnviosSchema.parse(req.query);

      const dados = await getCortesEnvios(opIcf);
      // console.log("Os tais dados", dados);

      res.status(HttpStatusCode.OK).json(dados);
    } catch (error) {
      return sendInternalError(res, error);
    }
  }
);

routesEnvios.post(
  "/",
  validaSchema(PostCortesEnvioSchema, "query"),
  async (req: Request, res: Response) => {
    try {
      const { nomeUser } = PostCortesEnvioSchema.parse(req.query);

      const dados = await postCortesEnvio(nomeUser);

      res.status(HttpStatusCode.OK).json(dados);
    } catch (error) {
      return sendInternalError(res, error);
    }
  }
);

routesEnvios.delete(
  "/",
  validaSchema(DeleteCortesEnvioSchema, "query"),
  async (req: Request, res: Response) => {
    try {
      const { nomeUser, idEnvio } = DeleteCortesEnvioSchema.parse(req.query);

      const dados = await deleteCortesEnvio(nomeUser, idEnvio);

      res.status(HttpStatusCode.OK).json(dados);
    } catch (error) {
      return sendInternalError(res, error);
    }
  }
);

export default routesEnvios;
