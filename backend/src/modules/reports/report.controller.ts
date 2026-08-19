import type { Request, Response } from "express";
import { reportService } from "./report.service.js";

export const reportController = {
  async overview(req: Request, res: Response): Promise<void> {
    const overview = await reportService.overview(req.user!.id);

    res.status(200).json({
      success: true,
      data: overview,
      message: "Resumen del dashboard obtenido",
    });
  },
};