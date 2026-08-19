import { createHash, randomBytes } from "node:crypto";
import argon2 from "argon2";
import jwt from "jsonwebtoken";
import type { SignOptions } from "jsonwebtoken";
import type { User } from "@prisma/client";
import { env } from "../../config/env.js";
import { prisma } from "../../lib/prisma.js";
import { HttpError } from "../../utils/httpError.js";
import type { LoginInput, RegisterInput } from "./auth.schemas.js";

export type SafeUser = Pick<User, "id" | "email" | "name" | "currency">;

export interface Session {
  user: SafeUser;
  accessToken: string;
  refreshToken: string;
  expiresAt: Date;
}

function toSafeUser(user: User): SafeUser {
  return { id: user.id, email: user.email, name: user.name, currency: user.currency };
}

function hashRefreshToken(token: string): string {
  return createHash("sha256").update(token).digest("hex");
}

function issueAccessToken(user: User): string {
  return jwt.sign(
    { sub: user.id, email: user.email, name: user.name, currency: user.currency },
    env.JWT_ACCESS_SECRET,
    { expiresIn: env.ACCESS_TOKEN_TTL as SignOptions["expiresIn"] },
  );
}

async function createRefreshToken(userId: string): Promise<{ token: string; expiresAt: Date }> {
  const token = randomBytes(48).toString("base64url");
  const expiresAt = new Date(Date.now() + env.REFRESH_TOKEN_TTL_DAYS * 24 * 60 * 60 * 1000);

  await prisma.refreshToken.create({
    data: { userId, tokenHash: hashRefreshToken(token), expiresAt },
  });

  return { token, expiresAt };
}

async function createSession(user: User): Promise<Session> {
  const accessToken = issueAccessToken(user);
  const refresh = await createRefreshToken(user.id);
  return { user: toSafeUser(user), accessToken, refreshToken: refresh.token, expiresAt: refresh.expiresAt };
}

async function findValidRefreshToken(token: string) {
  const tokenHash = hashRefreshToken(token);
  const record = await prisma.refreshToken.findUnique({
    where: { tokenHash },
    include: { user: true },
  });

  if (!record) throw new HttpError(401, "Sesión inválida");
  if (record.revokedAt) throw new HttpError(401, "La sesión ha sido revocada");
  if (record.expiresAt.getTime() < Date.now()) throw new HttpError(401, "La sesión ha expirado");

  return record;
}

export const authService = {
  async register(input: RegisterInput): Promise<SafeUser> {
    const existing = await prisma.user.findUnique({ where: { email: input.email } });
    if (existing) throw new HttpError(409, "Ya existe una cuenta con este email");

    const password = await argon2.hash(input.password);
    const user = await prisma.user.create({
      data: { name: input.name, email: input.email, password },
    });

    return toSafeUser(user);
  },

  async login(input: LoginInput): Promise<SafeUser> {
    const user = await prisma.user.findUnique({ where: { email: input.email } });
    if (!user) throw new HttpError(401, "Email o contraseña incorrectos");

    const isValid = await argon2.verify(user.password, input.password);
    if (!isValid) throw new HttpError(401, "Email o contraseña incorrectos");

    return toSafeUser(user);
  },

  async createSessionForUser(userId: string): Promise<Session> {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new HttpError(401, "Usuario no encontrado");
    return createSession(user);
  },

  async rotateSession(refreshToken: string): Promise<Session> {
    const record = await findValidRefreshToken(refreshToken);

    await prisma.refreshToken.update({
      where: { id: record.id },
      data: { revokedAt: new Date() },
    });

    return createSession(record.user);
  },

  async revokeRefreshToken(refreshToken: string | undefined): Promise<void> {
    if (!refreshToken) return;
    const tokenHash = hashRefreshToken(refreshToken);
    await prisma.refreshToken.updateMany({
      where: { tokenHash, revokedAt: null },
      data: { revokedAt: new Date() },
    });
  },
};
