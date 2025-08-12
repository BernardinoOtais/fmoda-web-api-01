import { checkAuth } from "@middlewares/android/check-auth";
import { Router } from "express";

import routesEnvios from "./envios";
import routesFim from "./fim";

const routesCortes = Router();

/**
 * Auth verification
 */
routesCortes.use(checkAuth());

routesCortes.use("/envios/", routesEnvios);

routesCortes.use("/fim/", routesFim);

export default routesCortes;
