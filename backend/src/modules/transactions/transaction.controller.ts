import type { Request, Response } from "express";
import { parseInput } from "../../utils/validate.js";
import {
  createTransactionSchema,
  transactionFiltersSchema,
  updateTransactionSchema,
} from "./transaction.schemas.js";
import { transactionService } from "./transaction.service.js";

export const transactionController = {
  async list(req: Request, res: Response): Promise<void> {
    const filters = parseInput(transactionFiltersSchema, req.query);
    const transactions = await transactionService.list(req.user!.id, filters);

    res.status(200).json({
      success: true,
      data: transactions,
      message: "Transacciones obtenidas",
    });
  },

  async get(req: Request, res: Response): Promise<void> {
    const transaction = await transactionService.get(req.user!.id, String(req.params.id));

    res.status(200).json({
      success: true,
      data: transaction,
      message: "Transacción obtenida",
    });
  },

  async create(req: Request, res: Response): Promise<void> {
    const input = parseInput(createTransactionSchema, req.body);
    const transaction = await transactionService.create(req.user!.id, input);

    res.status(201).json({
      success: true,
      data: transaction,
      message: "Transacción creada",
    });
  },

  async update(req: Request, res: Response): Promise<void> {
    const input = parseInput(updateTransactionSchema, req.body);
    const transaction = await transactionService.update(req.user!.id, String(req.params.id), input);

    res.status(200).json({
      success: true,
      data: transaction,
      message: "Transacción actualizada",
    });
  },

  async remove(req: Request, res: Response): Promise<void> {
    await transactionService.remove(req.user!.id, String(req.params.id));

    res.status(200).json({
      success: true,
      data: null,
      message: "Transacción eliminada",
    });
  },
};