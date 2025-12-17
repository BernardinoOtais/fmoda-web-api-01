import { server } from "@config/config";
import HttpStatusCode from "@utils/http-status-code";
import { Router } from "express";

import type { Response, Request } from "express";

const raiz = Router();

raiz.get("/", (req: Request, res: Response) => {
  res.status(HttpStatusCode.OK).json({
    tipo: server.NODE_ENV,
    dateTime: new Date().toISOString(),
    status: "RUNNING",
    protected: false,
    hello: "FMODA",
  });
});

export default raiz;
