import { validaSchema } from "@middlewares/valida-schema";
import { GetTraducaoSchema } from "@repo/tipos/tradutor";
import { tradutor } from "@repo/tradutor";
import { sendInternalError } from "@utils/utils";
import express, { Request, Response } from "express";

const routeTradutor = express.Router();

routeTradutor.get(
  "/",
  validaSchema(GetTraducaoSchema, "query"),
  async (req: Request, res: Response) => {
    try {
      const { sl, tl, q } = GetTraducaoSchema.parse(req.query);
      if (q === "") return res.json("");
      const resultado = await tradutor(sl, tl, q);

      res.json(resultado || "");
    } catch (err) {
      sendInternalError(res, err);
    }
  }
);

export default routeTradutor;
