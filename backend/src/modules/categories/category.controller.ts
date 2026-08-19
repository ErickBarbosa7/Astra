import type { Request, Response } from "express";
import { parseInput } from "../../utils/validate.js";
import { createCategorySchema, updateCategorySchema } from "./category.schemas.js";
import { categoryService } from "./category.service.js";

export const categoryController = {
  async list(req: Request, res: Response): Promise<void> {
    const categories = await categoryService.list(req.user!.id);

    res.status(200).json({
      success: true,
      data: categories,
      message: "Categorías obtenidas",
    });
  },

  async get(req: Request, res: Response): Promise<void> {
    const category = await categoryService.get(req.user!.id, String(req.params.id));

    res.status(200).json({
      success: true,
      data: category,
      message: "Categoría obtenida",
    });
  },

  async create(req: Request, res: Response): Promise<void> {
    const input = parseInput(createCategorySchema, req.body);
    const category = await categoryService.create(req.user!.id, input);

    res.status(201).json({
      success: true,
      data: category,
      message: "Categoría creada",
    });
  },

  async update(req: Request, res: Response): Promise<void> {
    const input = parseInput(updateCategorySchema, req.body);
    const category = await categoryService.update(req.user!.id, String(req.params.id), input);

    res.status(200).json({
      success: true,
      data: category,
      message: "Categoría actualizada",
    });
  },

  async remove(req: Request, res: Response): Promise<void> {
    await categoryService.remove(req.user!.id, String(req.params.id));

    res.status(200).json({
      success: true,
      data: null,
      message: "Categoría eliminada",
    });
  },
};
