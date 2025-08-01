import { server } from "@config/config";
import HttpStatusCode from "@utils/http-status-code";
import { Router } from "express";
import { PostPapeisSchema } from "@repo/tipos/user";

import type { Response, Request } from "express";

const routes = Router();

routes.get("/", (req: Request, res: Response) => {
  res.status(HttpStatusCode.OK).json({
    tipo: server.NODE_ENV,
    dateTime: new Date().toISOString(),
    status: "RUNNING",
    protected: false,
    hello: PostPapeisSchema,
  });
});

export default routes;
