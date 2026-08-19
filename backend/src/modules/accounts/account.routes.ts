import { Router } from "express";
import { requireAuth } from "../../middlewares/auth.middleware.js";
import { accountController } from "./account.controller.js";

const router = Router();

router.use(requireAuth);

router.get("/", accountController.list);
router.post("/", accountController.create);
router.get("/:id", accountController.get);
router.patch("/:id", accountController.update);
router.delete("/:id", accountController.remove);

export default router;