import { checkAuth } from "@middlewares/android/check-auth";
import { validaSchema } from "@middlewares/valida-schema";
import { fotoModelo } from "@repo/imagens";
import { GetFotoCaminho } from "@repo/tipos/android/imagem";
import HttpStatusCode from "@utils/http-status-code";
import { Router } from "express";

import type { Response, Request, NextFunction } from "express";

const routesImagem = Router();

/**
 * Auth verification
 */
routesImagem.use(checkAuth());

routesImagem.get(
  "/",
  validaSchema(GetFotoCaminho, "query"),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { caminho } = GetFotoCaminho.parse(req.query);
      const fotoParaGet = caminho.replace(/\\/g, /* "%2F"*/ "/");
      const foto = await fotoModelo(fotoParaGet);

      if (!foto) {
        return res.status(HttpStatusCode.NOT_FOUND).send("Image not found");
      }

      res.set("Content-Type", foto.contentType);
      res.send(Buffer.from(foto.fotoString, "base64"));
    } catch (error) {
      next(error);
    }
  }
);

export default routesImagem;
