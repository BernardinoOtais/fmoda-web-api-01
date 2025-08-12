import { checkAuth } from "@middlewares/android/check-auth";
import { validaSchema } from "@middlewares/valida-schema";
import { postAbreEnvio } from "@repo/db/android/especial";
import { AbrePedidoSchema } from "@repo/tipos/android/especial";
import HttpStatusCode from "@utils/http-status-code";
import { sendInternalError } from "@utils/utils";
import { Router } from "express";

import type { Response, Request } from "express";

const routesEspeciais = Router();

routesEspeciais.use(checkAuth("Bernardino"));

//AbrePedidoSchema
routesEspeciais.post(
  "/abrepedido",
  validaSchema(AbrePedidoSchema, "query"),
  async (req: Request, res: Response) => {
    try {
      const { idEnvioMarrocos } = AbrePedidoSchema.parse(req.query);

      const dados = await postAbreEnvio(idEnvioMarrocos);

      res.status(HttpStatusCode.OK).json(dados);
    } catch (error) {
      return sendInternalError(res, error);
    }
  }
);

export default routesEspeciais;
