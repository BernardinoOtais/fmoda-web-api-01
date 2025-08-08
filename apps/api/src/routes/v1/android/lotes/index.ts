import { Router } from "express";

import routesEnvios from "./envios";
import routesFim from "./fim";

const routesCortes = Router();

routesCortes.use("/envios/", routesEnvios);

routesCortes.use("/fim/", routesFim);

export default routesCortes;
