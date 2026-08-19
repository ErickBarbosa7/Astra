import { Router } from "express";
import { requireAuth } from "../../middlewares/auth.middleware.js";
import { reportController } from "./report.controller.js";

const router = Router();

router.use(requireAuth);

router.get("/overview", reportController.overview);

export default router;