import { Router } from "express";
import { prisma } from "../../lib/prisma.js";
import { HttpError } from "../../utils/httpError.js";

const router = Router();

router.get("/health", async (_req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    res.status(200).json({
      success: true,
      data: {
        status: "ok",
        database: "connected",
        uptime: process.uptime(),
      },
      message: "Servicio operativo",
    });
  } catch {
    throw new HttpError(503, "No se pudo conectar con la base de datos");
  }
});

export default router;
