import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { env } from "../config/env.js";
import { HttpError } from "../utils/httpError.js";

interface AccessTokenPayload {
  sub: string;
  email: string;
  name: string;
  currency: string;
}

export function requireAuth(req: Request, _res: Response, next: NextFunction): void {
  const header = req.headers.authorization;

  if (!header?.startsWith("Bearer ")) {
    throw new HttpError(401, "No autorizado: token no proporcionado");
  }

  try {
    const payload = jwt.verify(header.slice(7), env.JWT_ACCESS_SECRET) as AccessTokenPayload;
    req.user = {
      id: payload.sub,
      email: payload.email,
      name: payload.name,
      currency: payload.currency,
    };
    next();
  } catch {
    throw new HttpError(401, "No autorizado: token inválido o expirado");
  }
}
