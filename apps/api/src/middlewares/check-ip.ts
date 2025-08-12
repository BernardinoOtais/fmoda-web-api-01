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
      console.log("ipPermitido :", ipPermitido);
      const ip = extractClientIP(req);

      console.log("o claude", ip);

      if (typeof ip === "string") {
        const normalizedIP = ip.startsWith("::ffff:") ? ip.slice(7) : ip;

        console.log(
          "normalizedIP: ",
          normalizedIP,
          " ipPermitido :",
          ipPermitido,
          " ip: ",
          ip
        );
        if (normalizedIP === ipPermitido) return next();
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
