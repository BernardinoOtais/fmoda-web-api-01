import { Router } from "express";

import routesLotes from "./lotes";

const routesEnvios = Router();

routesEnvios.use("/lotes/", routesLotes);

export default routesEnvios;
