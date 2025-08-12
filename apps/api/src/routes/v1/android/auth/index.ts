import { server } from "@config/config";
import { validaSchema } from "@middlewares/valida-schema";
import { getUserDb } from "@repo/db/android/auth";
import { verifyPassword } from "@repo/encryption/argon2";
import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} from "@repo/encryption/jwt";
import {
  LoginAndroidSchema,
  RefreshTokenSchema,
} from "@repo/tipos/android_auth";
import HttpStatusCode from "@utils/http-status-code";
import { sendInternalError } from "@utils/utils";
import { Router } from "express";

import type { Response, Request } from "express";

const authRoutes = Router();

authRoutes.get("/", (req: Request, res: Response) => {
  res.status(HttpStatusCode.OK).json({
    tipo: server.NODE_ENV,
    dateTime: new Date().toISOString(),
    status: "RUNNING",
    protected: false,
    hello: "auth",
  });
});

authRoutes.post(
  "/login",
  validaSchema(LoginAndroidSchema),
  async (req: Request, res: Response) => {
    try {
      const parsed = LoginAndroidSchema.safeParse(req.body);

      if (!parsed.success) {
        return res.status(HttpStatusCode.BAD_REQUEST).json({
          message: "Dados inválidos",
          errors: parsed.error.issues,
        });
      }

      const { nomeUser, pass } = parsed.data;

      const user = await getUserDb(nomeUser);
      const hashedPassword = user?.account?.[0]?.password;

      if (!user || !hashedPassword) {
        return res.status(HttpStatusCode.FORBIDDEN).json({
          message: "Credenciais inválidas",
        });
      }

      const passVerificada = await verifyPassword({
        password: pass,
        hash: hashedPassword,
      });

      if (!passVerificada) {
        return res.status(HttpStatusCode.FORBIDDEN).json({
          message: "Credenciais inválidas",
        });
      }

      const token = generateAccessToken({ nomeUser });
      const refreshToken = generateRefreshToken({ nomeUser });

      // optionally save refresh token in DB

      return res.status(HttpStatusCode.OK).json({
        nomeUser,
        nome: user.name,
        apelido: user.apelido,
        token,
        refreshToken,
      });
    } catch (error) {
      console.error("Login error:", error);
      return sendInternalError(res, error);
    }
  }
);
authRoutes.post(
  "/token",
  validaSchema(RefreshTokenSchema),
  async (req: Request, res: Response) => {
    try {
      const parsed = RefreshTokenSchema.safeParse(req.body);
      if (!parsed.success) {
        return res.status(HttpStatusCode.BAD_REQUEST).json({
          message: "Dados inválidos",
          errors: parsed.error.issues,
        });
      }
      const { nomeUser, refreshToken: refreshTokenRecebido } = parsed.data;

      const decodeRefreshToken = verifyRefreshToken(refreshTokenRecebido);
      if (!decodeRefreshToken)
        return res.status(HttpStatusCode.FORBIDDEN).json({
          message: "Dados inválidos",
        });
      if (decodeRefreshToken.nomeUser !== nomeUser)
        return res.status(HttpStatusCode.FORBIDDEN).json({
          message: "Dados inválidos",
        });

      const token = generateAccessToken({ nomeUser });
      const refreshToken = generateRefreshToken({ nomeUser });

      return res.status(HttpStatusCode.OK).json({
        nomeUser,
        token,
        refreshToken,
      });
    } catch (error) {
      console.error("RefresToken", error);
      return sendInternalError(res, error);
    }
  }
);

export default authRoutes;
