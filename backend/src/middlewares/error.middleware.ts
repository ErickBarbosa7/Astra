import type { NextFunction, Request, Response } from "express";
import { env } from "../config/env.js";
import { HttpError } from "../utils/httpError.js";

export const notFoundHandler = (_req: Request, res: Response): void => {
  res.status(404).json({
    success: false,
    data: null,
    message: "Recurso no encontrado",
  });
};

export const errorHandler = (
  error: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction,
): void => {
  const statusCode = error instanceof HttpError ? error.statusCode : 500;
  const message = error instanceof Error ? error.message : "Error interno del servidor";

  if (env.NODE_ENV !== "production") {
    console.error(error);
  }

  res.status(statusCode).json({
    success: statusCode < 400,
    data: null,
    message,
  });
};
