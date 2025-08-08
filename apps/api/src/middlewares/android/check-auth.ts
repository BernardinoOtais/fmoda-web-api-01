import { verifyAccessToken } from "@repo/encryption/jwt";
import { JwtPayloadSchema } from "@repo/tipos/android_auth";
import HttpStatusCode from "@utils/http-status-code";
import z from "zod";

import type { Request, Response, NextFunction } from "express";

interface CustomRequest extends Request {
  userData?: z.infer<typeof JwtPayloadSchema>;
}

export const checkAuth = (nomeUser?: string) => {
  return (req: CustomRequest, res: Response, next: NextFunction) => {
    try {
      //console.log("[checkAuth] Start middleware");

      //console.log("[checkAuth] Start middleware header", req.headers);
      const authHeader = req.headers.authorization;
      //console.log("[checkAuth] Authorization header:", authHeader);

      if (!authHeader || !authHeader.startsWith("Bearer ")) {
        //console.log("[checkAuth] Missing or malformed Authorization header");
        return res.status(HttpStatusCode.UNAUTHORIZED).json({
          message: "Token ausente ou mal formatado",
        });
      }

      const token = authHeader.split(" ")[1];
      //console.log("[checkAuth] Extracted token:", token);

      if (!token) {
        // console.log("[checkAuth] Token string is empty");
        return res.status(HttpStatusCode.UNAUTHORIZED).json({
          message: "Token ausente ou mal formatado",
        });
      }

      const decoded = verifyAccessToken(token);
      // console.log("[checkAuth] Decoded token payload:", decoded);

      if (!decoded) {
        //console.log("[checkAuth] Token verification failed");
        return res.status(HttpStatusCode.UNAUTHORIZED).json({
          message: "Token ausente ou mal formatado",
        });
      }

      const nomeUserDecoded = decoded.nomeUser;
      //console.log("[checkAuth] Decoded nomeUser:", nomeUserDecoded);

      if (nomeUser && nomeUserDecoded !== nomeUser) {
        /*console.log(
          `[checkAuth] nomeUser mismatch: expected '${nomeUser}', got '${nomeUserDecoded}'`
        );*/
        return res.status(HttpStatusCode.UNAUTHORIZED).json({
          message: "Utilizador não tem permissaão para executar",
        });
      }

      req.userData = decoded;
      //console.log("[checkAuth] User data attached to request:", req.userData);

      //console.log("[checkAuth] Passing to next middleware");
      next();
    } catch (error) {
      console.error("[checkAuth] Middleware error:", error);
      res.status(HttpStatusCode.UNAUTHORIZED).json({
        message: "Token inválido",
      });
    }
  };
};
