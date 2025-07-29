import HttpStatusCode from "@utils/http-status-code";

import type { Request, Response, NextFunction } from "express";

/**
 * Middleware CORS personalizado para gerir o Cross-Origin Resource Sharing.
 */
export const corsHandler = (allowedOrigins: string[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const origin = req.headers.origin;

    // Permitir pedidos sem origem (ex.: apps Android, Postman, curl)
    if (!origin) {
      res.setHeader("Access-Control-Allow-Origin", "*");
    } else if (allowedOrigins.includes(origin)) {
      res.setHeader("Access-Control-Allow-Origin", origin);
    } else {
      // Bloquear pedidos de origens não permitidas com uma resposta adequada
      res
        .status(HttpStatusCode.FORBIDDEN)
        .json({ message: "Origem não permitida" });
      return;
    }

    // Definir cabeçalhos CORS
    res.setHeader("Access-Control-Allow-Credentials", "true");
    res.setHeader(
      "Access-Control-Allow-Methods",
      "GET, POST, PUT, DELETE, OPTIONS"
    );
    res.setHeader(
      "Access-Control-Allow-Headers",
      "Content-Type, Authorization, X-Requested-With, Accept"
    );
    res.setHeader("Access-Control-Expose-Headers", "Authorization");

    // Tratar pedidos preflight (OPTIONS)
    if (req.method === "OPTIONS") {
      res.status(HttpStatusCode.NO_CONTENT).end();
      return;
    }

    next();
  };
};
