import { Router } from "express";
import { requireAuth } from "../../middlewares/auth.middleware.js";
import { transactionController } from "./transaction.controller.js";

const router = Router();

router.use(requireAuth);

router.get("/", transactionController.list);
router.post("/", transactionController.create);
router.get("/:id", transactionController.get);
router.patch("/:id", transactionController.update);
router.delete("/:id", transactionController.remove);

export default router;