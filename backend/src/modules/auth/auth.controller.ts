import type { Request, Response } from "express";
import { env } from "../../config/env.js";
import { HttpError } from "../../utils/httpError.js";
import { parseInput } from "../../utils/validate.js";
import { loginSchema, registerSchema } from "./auth.schemas.js";
import { authService } from "./auth.service.js";

export const REFRESH_COOKIE_NAME = "refreshToken";

const cookieOptions = {
  httpOnly: true,
  sameSite: "lax" as const,
  secure: env.COOKIE_SECURE,
  path: "/",
};

function setRefreshCookie(res: Response, token: string, expiresAt: Date): void {
  res.cookie(REFRESH_COOKIE_NAME, token, {
    ...cookieOptions,
    expires: expiresAt,
  });
}

function clearRefreshCookie(res: Response): void {
  res.clearCookie(REFRESH_COOKIE_NAME, cookieOptions);
}

function getRefreshToken(req: Request): string | undefined {
  const token = req.cookies[REFRESH_COOKIE_NAME];
  return typeof token === "string" && token.length > 0 ? token : undefined;
}

export const authController = {
  async register(req: Request, res: Response): Promise<void> {
    const input = parseInput(registerSchema, req.body);
    const user = await authService.register(input);
    const session = await authService.createSessionForUser(user.id);

    setRefreshCookie(res, session.refreshToken, session.expiresAt);
    res.status(201).json({
      success: true,
      data: { user: session.user, accessToken: session.accessToken },
      message: "Cuenta creada correctamente",
    });
  },

  async login(req: Request, res: Response): Promise<void> {
    const input = parseInput(loginSchema, req.body);
    const user = await authService.login(input);
    const session = await authService.createSessionForUser(user.id);

    setRefreshCookie(res, session.refreshToken, session.expiresAt);
    res.status(200).json({
      success: true,
      data: { user: session.user, accessToken: session.accessToken },
      message: "Sesión iniciada",
    });
  },

  async refresh(req: Request, res: Response): Promise<void> {
    const refreshToken = getRefreshToken(req);
    if (!refreshToken) throw new HttpError(401, "Sesión inválida");
    const session = await authService.rotateSession(refreshToken);

    setRefreshCookie(res, session.refreshToken, session.expiresAt);
    res.status(200).json({
      success: true,
      data: { user: session.user, accessToken: session.accessToken },
      message: "Sesión renovada",
    });
  },

  async logout(req: Request, res: Response): Promise<void> {
    const refreshToken = getRefreshToken(req);
    await authService.revokeRefreshToken(refreshToken);
    clearRefreshCookie(res);

    res.status(200).json({ success: true, data: null, message: "Sesión cerrada" });
  },

  async me(req: Request, res: Response): Promise<void> {
    res.status(200).json({
      success: true,
      data: { user: req.user },
      message: "Usuario autenticado",
    });
  },
};
