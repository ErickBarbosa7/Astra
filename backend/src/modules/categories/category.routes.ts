import { Router } from "express";
import { requireAuth } from "../../middlewares/auth.middleware.js";
import { categoryController } from "./category.controller.js";

const router = Router();

router.use(requireAuth);

router.get("/", categoryController.list);
router.post("/", categoryController.create);
router.get("/:id", categoryController.get);
router.patch("/:id", categoryController.update);
router.delete("/:id", categoryController.remove);

export default router;
