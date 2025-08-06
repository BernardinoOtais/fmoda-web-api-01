import { server } from "@config/config";
import { getEnvio } from "@repo/db/android/marrocos/envios";
import HttpStatusCode from "@utils/http-status-code";
import { Router } from "express";

import type { Response, Request } from "express";

const routesMarrocosEnvios = Router();

routesMarrocosEnvios.get("/", async (req: Request, res: Response) => {
  const coisas = await getEnvio("");
  res.status(HttpStatusCode.OK).json({
    tipo: server.NODE_ENV,
    dateTime: new Date().toISOString(),
    status: "RUNNING",
    protected: false,
    hello: "Marrocos envios",
    coisas,
  });
});

export default routesMarrocosEnvios;
