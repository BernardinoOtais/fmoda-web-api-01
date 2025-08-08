import { validaSchema } from "@middlewares/valida-schema";
import {
  getDestinos,
  getEnvioMarrocosFimPhc,
  getResumo,
  getTermina,
  postPesos,
} from "@repo/db/android/marrocos/envios/fim";
import {
  EnvioMarrocosFimResumoRowsSchema,
  EnvioMarrocosFimRowsSchema,
  GetPesos,
  ListaPedidosEPesos,
  TerminaEnvioSchema,
} from "@repo/tipos/android/marrocos/envios/fim";
import HttpStatusCode from "@utils/http-status-code";
import { Router } from "express";

import type { Response, Request, NextFunction } from "express";

const routesMarrocosEnviosFim = Router();

routesMarrocosEnviosFim.get(
  "/destinos",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const dados = await getDestinos();
      res.status(HttpStatusCode.OK).json(dados);
    } catch (error) {
      next(error);
    }
  }
);

routesMarrocosEnviosFim.get(
  "/:idEnvioMarrocos",
  validaSchema(GetPesos, "params"),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { idEnvioMarrocos } = GetPesos.parse(req.params);
      const dados = await getEnvioMarrocosFimPhc(idEnvioMarrocos);

      const rows = EnvioMarrocosFimRowsSchema.parse(dados); // ✅ Type-safe parsing

      const dadosTratados = rows.map((item) => {
        try {
          return {
            ...item,
            dados: JSON.parse(item.dados),
          };
        } catch {
          return {
            ...item,
            dados: null, // Or handle error appropriately
          };
        }
      });
      //console.log(JSON.stringify(dadosTratados, null, 2));
      res.status(HttpStatusCode.OK).json(dadosTratados);
    } catch (error) {
      next(error);
    }
  }
);

routesMarrocosEnviosFim.post(
  "/gravalista",
  validaSchema(ListaPedidosEPesos),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { listaPedidosEPesos } = ListaPedidosEPesos.parse(req.body);
      const listaPedidosEPesosParaPost = "[" + listaPedidosEPesos + "]";
      const dados = await postPesos(listaPedidosEPesosParaPost);

      const rows = EnvioMarrocosFimRowsSchema.parse(dados);

      const dadosTratados = rows.map((item) => {
        try {
          return {
            ...item,
            dados: JSON.parse(item.dados),
          };
        } catch {
          return {
            ...item,
            dados: null,
          };
        }
      });
      //console.log(JSON.stringify(dadosTratados, null, 2));
      res.status(HttpStatusCode.OK).json(dadosTratados);
    } catch (error) {
      next(error);
    }
  }
);

routesMarrocosEnviosFim.get(
  "/resumo/:idEnvioMarrocos",
  validaSchema(GetPesos, "params"),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { idEnvioMarrocos } = GetPesos.parse(req.params);
      const dados = await getResumo(idEnvioMarrocos);
      //EnvioMarrocosFimResumoRowsSchema
      const rows = EnvioMarrocosFimResumoRowsSchema.parse(dados);

      const dadosTratados = rows.map((item) => {
        try {
          return {
            ...item,
            opPedidosCorParteQtde: JSON.parse(item.opPedidosCorParteQtde),
          };
        } catch {
          return {
            ...item,
            opPedidosCorParteQtde: null,
          };
        }
      });
      //console.log(JSON.stringify(dados, null, 2));
      //console.log(JSON.stringify(dadosTratados, null, 2));
      res.status(HttpStatusCode.OK).json(dadosTratados);
    } catch (error) {
      next(error);
    }
  }
);

routesMarrocosEnviosFim.get(
  "/termina/:idEnvioMarrocos",
  validaSchema(TerminaEnvioSchema, "params"),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { idEnvioMarrocos } = TerminaEnvioSchema.parse(req.params);
      const dados = await getTermina(idEnvioMarrocos);
      res.status(HttpStatusCode.OK).json(dados);
    } catch (error) {
      next(error);
    }
  }
);
export default routesMarrocosEnviosFim;
