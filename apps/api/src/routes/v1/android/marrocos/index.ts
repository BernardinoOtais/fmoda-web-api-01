import { checkAuth } from "@middlewares/android/check-auth";
import { Router } from "express";

import routesMarrocosCaixas from "./caixas";
import routesMarrocosEnvios from "./envios";
import routesMarrocosPaletes from "./palete";

const routesMarrocos = Router();

/**
 * Auth verification
 */
routesMarrocos.use(checkAuth());

routesMarrocos.use("/envios/", routesMarrocosEnvios);
routesMarrocos.use("/paletes/", routesMarrocosPaletes);
routesMarrocos.use("/caixas/", routesMarrocosCaixas);

export default routesMarrocos;
