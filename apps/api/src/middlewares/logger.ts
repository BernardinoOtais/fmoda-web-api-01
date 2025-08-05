import logger from "@config/logger";

import type { Request, Response, NextFunction } from "express";

/**
 * Middleware para registar pedidos HTTP usando Winston.
 */
export const requestLogger = () => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const { method, url, headers } = req;
    const startTime = Date.now();

    // Registar detalhes do pedido recebido
    logger.info(`Pedido recebido: ${method} ${url}`, {
      headers: {
        "user-agent": headers["user-agent"],
        origin: headers.origin,
      },
    });

    // Capturar detalhes da resposta
    const originalSend = res.send;
    res.send = function (body) {
      const responseTime = Date.now() - startTime;

      // Registar detalhes da resposta enviada
      logger.info(`Resposta enviada: ${method} ${url}`, {
        status: res.statusCode,
        responseTime: `${responseTime}ms`,
        body: body instanceof Buffer ? body.toString() : body,
      });

      return originalSend.call(this, body);
    };

    // Passar para o próximo middleware ou controlador de rota
    next();
  };
};
