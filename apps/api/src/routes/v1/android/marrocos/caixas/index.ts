import { validaSchema } from "@middlewares/valida-schema";
import {
  deleteCaixaEDevolveLista,
  deleteCaixaMasDeixaCaixa,
  deleteCaixasEDevolveLista,
  getCaixas,
  getResetNumeroCaixas,
  patchQuantidadeCaixa,
  postJuntaCaixas,
  postNovaCaixa,
  postSubstituiCaixa,
} from "@repo/db/android/marrocos/caixas";
import {
  DeleteCaixasSchema,
  DeleteListaCaixasBodySchema,
  DeleteListaCaixasQuerySchema,
  GetCaixasSchema,
  JuntaCaixasSchema,
  PatchQuantidadeDaCaixaSchema,
  PostNovaCaixaSchema,
  PostSubstituiCaixaSchema,
} from "@repo/tipos/android/marrocos/caixas";
import HttpStatusCode from "@utils/http-status-code";
import { sendInternalError } from "@utils/utils";
import { Router } from "express";

import type { Response, Request } from "express";

const routesMarrocosCaixas = Router();

routesMarrocosCaixas.get(
  "/apagamas/:idEnvioMarrocosCaixas",
  validaSchema(DeleteCaixasSchema, "params"),
  async (req: Request, res: Response) => {
    try {
      const { idEnvioMarrocosCaixas } = DeleteCaixasSchema.parse(req.params);
      const dados = await deleteCaixaMasDeixaCaixa(idEnvioMarrocosCaixas);

      res.status(HttpStatusCode.OK).json(dados);
    } catch (error) {
      return sendInternalError(res, error);
    }
  }
);

routesMarrocosCaixas.get(
  "/reset/:idEnvioMarrocosPalete",
  validaSchema(GetCaixasSchema, "params"),
  async (req: Request, res: Response) => {
    try {
      const { idEnvioMarrocosPalete } = GetCaixasSchema.parse(req.params);
      const dados = await getResetNumeroCaixas(idEnvioMarrocosPalete);

      res.status(HttpStatusCode.OK).json(dados);
    } catch (error) {
      return sendInternalError(res, error);
    }
  }
);

routesMarrocosCaixas.get(
  "/:idEnvioMarrocosPalete",
  validaSchema(GetCaixasSchema, "params"),
  async (req: Request, res: Response) => {
    try {
      const { idEnvioMarrocosPalete } = GetCaixasSchema.parse(req.params);
      const dados = await getCaixas(idEnvioMarrocosPalete);

      res.status(HttpStatusCode.OK).json(dados);
    } catch (error) {
      return sendInternalError(res, error);
    }
  }
);

routesMarrocosCaixas.delete(
  "/listaedevolve",
  validaSchema(DeleteListaCaixasQuerySchema, "query"),
  validaSchema(DeleteListaCaixasBodySchema),

  async (req: Request, res: Response) => {
    try {
      console.log("O tais body", req.body);
      console.log("O tais query", req.query);
      const { idEnvioMarrocosCaixas } = DeleteListaCaixasBodySchema.parse(
        req.body
      );
      const { idEnvioMarrocosPalete } = DeleteListaCaixasQuerySchema.parse(
        req.query
      );
      const dados = await deleteCaixasEDevolveLista(
        idEnvioMarrocosPalete,
        idEnvioMarrocosCaixas
      );

      res.status(HttpStatusCode.OK).json(dados);
    } catch (error) {
      return sendInternalError(res, error);
    }
  }
);

routesMarrocosCaixas.delete(
  "/:idEnvioMarrocosCaixas",
  validaSchema(DeleteCaixasSchema, "params"),
  async (req: Request, res: Response) => {
    try {
      const { idEnvioMarrocosCaixas } = DeleteCaixasSchema.parse(req.params);
      const dados = await deleteCaixaEDevolveLista(idEnvioMarrocosCaixas);

      res.status(HttpStatusCode.OK).json(dados);
    } catch (error) {
      return sendInternalError(res, error);
    }
  }
);

routesMarrocosCaixas.post(
  "/junta",
  validaSchema(JuntaCaixasSchema, "query"),
  async (req: Request, res: Response) => {
    try {
      const { idEnvioMarrocosCaixas, idEnvioMarrocosPalete } =
        JuntaCaixasSchema.parse(req.query);
      const dados = await postJuntaCaixas(
        idEnvioMarrocosCaixas,
        idEnvioMarrocosPalete
      );
      res.status(HttpStatusCode.OK).json(dados);
    } catch (error) {
      return sendInternalError(res, error);
    }
  }
);

routesMarrocosCaixas.post(
  "/substitui",
  validaSchema(PostSubstituiCaixaSchema, "query"),
  async (req: Request, res: Response) => {
    try {
      const { idEnvioMarrocosCaixas, nomeUser, codIcf } =
        PostSubstituiCaixaSchema.parse(req.query);
      const dados = await postSubstituiCaixa(
        idEnvioMarrocosCaixas,
        nomeUser,
        codIcf
      );
      res.status(HttpStatusCode.OK).json(dados);
    } catch (error) {
      return sendInternalError(res, error);
    }
  }
);

routesMarrocosCaixas.post(
  "/",
  validaSchema(PostNovaCaixaSchema),
  async (req: Request, res: Response) => {
    try {
      console.log("Post nova Caixa");
      const { idEnvioMarrocosPalete, nomeUser, codIcf } =
        PostNovaCaixaSchema.parse(req.body);
      const dados = await postNovaCaixa(
        idEnvioMarrocosPalete,
        nomeUser,
        codIcf
      );
      res.status(HttpStatusCode.OK).json(dados);
    } catch (error) {
      return sendInternalError(res, error);
    }
  }
);

routesMarrocosCaixas.patch(
  "/",
  validaSchema(PatchQuantidadeDaCaixaSchema),
  async (req: Request, res: Response) => {
    try {
      const { idEnvioMarrocosCaixas, nomeUser, valorInserido } =
        PatchQuantidadeDaCaixaSchema.parse(req.body);
      const dados = await patchQuantidadeCaixa(
        idEnvioMarrocosCaixas,
        nomeUser,
        valorInserido
      );
      res.status(HttpStatusCode.OK).json(dados);
    } catch (error) {
      return sendInternalError(res, error);
    }
  }
);

export default routesMarrocosCaixas;
