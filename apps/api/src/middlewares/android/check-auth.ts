import { verifyRefreshToken } from "@repo/encryption/jwt";
import { JwtPayloadSchema } from "@repo/tipos/android_auth";
import HttpStatusCode from "@utils/http-status-code";
import z from "zod";

import type { Request, Response, NextFunction } from "express";

interface CustomRequest extends Request {
  userData?: z.infer<typeof JwtPayloadSchema>;
}

export const checkAuth = (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(HttpStatusCode.FORBIDDEN).json({
        message: "Token ausente ou mal formatado",
      });
    }

    const token = authHeader.split(" ")[1];

    if (!token) {
      return res.status(HttpStatusCode.FORBIDDEN).json({
        message: "Token ausente ou mal formatado",
      });
    }

    const decoded = verifyRefreshToken(token);

    if (!decoded) {
      return res.status(HttpStatusCode.FORBIDDEN).json({
        message: "Token ausente ou mal formatado",
      });
    }

    req.userData = decoded;

    next();
  } catch (error) {
    console.error("Middleware", error);
    res.status(HttpStatusCode.FORBIDDEN).json({
      message: "Token inválido",
    });
  }
};
