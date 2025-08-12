import { validaSchema } from "@middlewares/valida-schema";
import {
  getCortesLotes,
  postCortesLote,
  deleteCortesLote,
} from "@repo/db/android/cortes/envios/lotes";
import {
  DeleteCortesLoteSchema,
  GetCortesLotesSchema,
  PostCortesLoteSchema,
} from "@repo/tipos/android/cortes/envios/lotes";
import HttpStatusCode from "@utils/http-status-code";
import { sendInternalError } from "@utils/utils";
import { Router } from "express";

import type { Response, Request } from "express";

const routesLotes = Router();

routesLotes.get(
  "/",
  validaSchema(GetCortesLotesSchema, "query"),
  async (req: Request, res: Response) => {
    try {
      const { controlo, idEnvio } = GetCortesLotesSchema.parse(req.query);

      const dados = await getCortesLotes(controlo, idEnvio);

      res.status(HttpStatusCode.OK).json(dados);
    } catch (error) {
      return sendInternalError(res, error);
    }
  }
);

routesLotes.post(
  "/",
  validaSchema(PostCortesLoteSchema, "query"),
  async (req: Request, res: Response) => {
    try {
      const { nomeUser, codigoIcf, idEnvio, qtdeAlterada, nLote } =
        PostCortesLoteSchema.parse(req.query);

      const dados = await postCortesLote(
        nomeUser,
        codigoIcf,
        idEnvio,
        qtdeAlterada,
        nLote
      );

      res.status(HttpStatusCode.OK).json(dados);
    } catch (error) {
      return sendInternalError(res, error);
    }
  }
);

routesLotes.delete(
  "/",
  validaSchema(DeleteCortesLoteSchema, "query"),
  async (req: Request, res: Response) => {
    try {
      const { idEnvio, codigoIcf } = DeleteCortesLoteSchema.parse(req.query);

      const dados = await deleteCortesLote(idEnvio, codigoIcf);

      res.status(HttpStatusCode.OK).json(dados);
    } catch (error) {
      return sendInternalError(res, error);
    }
  }
);

export default routesLotes;
