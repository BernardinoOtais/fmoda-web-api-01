import { server } from "@config/config";
import HttpStatusCode from "@utils/http-status-code";
import { Router } from "express";

import androidRoutes from "./android/index";
import qrcode from "./qrcode.ts";

import type { Response, Request } from "express";

const routes = Router();

routes.get("/", (req: Request, res: Response) => {
  res.status(HttpStatusCode.OK).json({
    tipo: server.NODE_ENV,
    dateTime: new Date().toISOString(),
    status: "RUNNING",
    protected: false,
    hello: "world",
  });
});

routes.use("/android", androidRoutes);
routes.use("/qrcode", qrcode);

export default routes;
