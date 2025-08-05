import { JwtPayloadSchema } from "@repo/tipos/android_auth";
import jwt from "jsonwebtoken";
import z from "zod";

const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET!;
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET!;

if (!ACCESS_TOKEN_SECRET || !REFRESH_TOKEN_SECRET) {
  throw new Error("Missing JWT secrets in .env");
}

export function generateAccessToken(
  payload: z.infer<typeof JwtPayloadSchema>
): string {
  return jwt.sign(payload, ACCESS_TOKEN_SECRET, { expiresIn: "15m" });
}

export function generateRefreshToken(
  payload: z.infer<typeof JwtPayloadSchema>
): string {
  return jwt.sign(payload, REFRESH_TOKEN_SECRET, { expiresIn: "7d" });
}

export function verifyAccessToken(
  token: string
): z.infer<typeof JwtPayloadSchema> | null {
  try {
    return jwt.verify(token, ACCESS_TOKEN_SECRET) as z.infer<
      typeof JwtPayloadSchema
    >;
  } catch {
    return null;
  }
}

export function verifyRefreshToken(
  token: string
): z.infer<typeof JwtPayloadSchema> | null {
  try {
    return jwt.verify(token, REFRESH_TOKEN_SECRET) as z.infer<
      typeof JwtPayloadSchema
    >;
  } catch {
    return null;
  }
}
