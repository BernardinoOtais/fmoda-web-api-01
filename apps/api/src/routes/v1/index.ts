import { server } from "@config/config";
import { getEnvioDb } from "@repo/db/embarques_idenvio";
import { LoginAndroidSchema } from "@repo/tipos/android_auth";
import HttpStatusCode from "@utils/http-status-code";
import { Router } from "express";

import type { Response, Request } from "express";

const routes = Router();

routes.get("/", async (req: Request, res: Response) => {
  const coisa = await getEnvioDb({ id: 1 });

  res.status(HttpStatusCode.OK).json({
    tipo: server.NODE_ENV,
    dateTime: new Date().toISOString(),
    status: "RUNNING",
    protected: false,
    hello: LoginAndroidSchema,
    coisa,
  });
});

export default routes;
