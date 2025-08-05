import { server } from "@config/config";
import HttpStatusCode from "@utils/http-status-code";
import { Router } from "express";

import authRoutes from "./auth";

import type { Response, Request } from "express";

const androidRoutes = Router();

androidRoutes.get("/", (req: Request, res: Response) => {
  res.status(HttpStatusCode.OK).json({
    tipo: server.NODE_ENV,
    dateTime: new Date().toISOString(),
    status: "RUNNING",
    protected: false,
    hello: "Android",
  });
});

androidRoutes.use("/auth/", authRoutes);

export default androidRoutes;
