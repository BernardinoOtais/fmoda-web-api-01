import { server } from "@config/config";
import { extractClientIP } from "@utils/get-ip";
import HttpStatusCode from "@utils/http-status-code";

import type { Request, Response, NextFunction } from "express";

/**
 * Middleware para registar pedidos HTTP usando Winston.
 */
export const checkIp = () => {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      const ipPermitido = server.IP_PERMITIDO;

      const ip = extractClientIP(req);

      if (typeof ip === "string") {
        if (ip === ipPermitido) return next();
      }

      res.status(HttpStatusCode.UNAUTHORIZED).json({ message: "Auth failed" });
    } catch (error) {
      console.error(
        "Authentication error:",
        error instanceof Error ? error.message : String(error)
      );
      res.status(HttpStatusCode.UNAUTHORIZED).json({ message: "Auth failed" });
    }
  };
};
