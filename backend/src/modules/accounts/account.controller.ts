import type { Request, Response } from "express";
import { parseInput } from "../../utils/validate.js";
import { createAccountSchema, updateAccountSchema } from "./account.schemas.js";
import { accountService } from "./account.service.js";

export const accountController = {
  async list(req: Request, res: Response): Promise<void> {
    const accounts = await accountService.list(req.user!.id);

    res.status(200).json({
      success: true,
      data: accounts,
      message: "Cuentas obtenidas",
    });
  },

  async get(req: Request, res: Response): Promise<void> {
    const account = await accountService.get(req.user!.id, String(req.params.id));

    res.status(200).json({
      success: true,
      data: account,
      message: "Cuenta obtenida",
    });
  },

  async create(req: Request, res: Response): Promise<void> {
    const input = parseInput(createAccountSchema, req.body);
    const account = await accountService.create(req.user!.id, input);

    res.status(201).json({
      success: true,
      data: account,
      message: "Cuenta creada",
    });
  },

  async update(req: Request, res: Response): Promise<void> {
    const input = parseInput(updateAccountSchema, req.body);
    const account = await accountService.update(req.user!.id, String(req.params.id), input);

    res.status(200).json({
      success: true,
      data: account,
      message: "Cuenta actualizada",
    });
  },

  async remove(req: Request, res: Response): Promise<void> {
    await accountService.remove(req.user!.id, String(req.params.id));

    res.status(200).json({
      success: true,
      data: null,
      message: "Cuenta eliminada",
    });
  },
};