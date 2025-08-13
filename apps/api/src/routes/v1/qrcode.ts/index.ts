import { checkIp } from "@middlewares/check-ip";
import { validaSchema } from "@middlewares/valida-schema";
import { escreveQrcode } from "@repo/imagens/qrcode";
import { NovoQrcodeSchema } from "@repo/tipos/qrcode";
import HttpStatusCode from "@utils/http-status-code";
import { sendInternalError } from "@utils/utils";
import { Router } from "express";

import type { Response, Request } from "express";

const qrcode = Router();

/**
 * Auth verification
 */
//qrcode.use(checkIp());

qrcode.get(
  "/",
  validaSchema(NovoQrcodeSchema, "query"),
  async (req: Request, res: Response) => {
    try {
      const queryValidada = NovoQrcodeSchema.safeParse(req.query);

      if (!queryValidada.success) {
        return res.status(HttpStatusCode.OK).json(queryValidada.error);
      }

      const { dados, nome } = queryValidada.data;

      const dadosRecebidos = await escreveQrcode(dados, nome);

      return res.status(HttpStatusCode.OK).json(dadosRecebidos || "");
    } catch (error) {
      console.error("Erro ao criar QRCODE:", error);
      return sendInternalError(res, error);
    }
  }
);

export default qrcode;
