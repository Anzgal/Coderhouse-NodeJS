/**
 * @swagger
 * tags:
 *   name: Logger
 *   description: Logger endpoints
 * /:
 *   get:
 *     summary: Returns the logger
 *     tags: [Logger]
 *     responses:
 *       200:
 *         description: The logger
 *         content:
 *           application/json:
 */

import { Router } from "express";
import { loggerController } from "../controllers/logger.controller.js";

const router = Router();

router.get("/", loggerController);

export default router;
